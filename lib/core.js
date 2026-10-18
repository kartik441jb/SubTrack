// Shared helpers for Vercel serverless functions (zero npm deps).
const E = process.env;
const U = E.UPSTASH_REDIS_REST_URL || E.KV_REST_API_URL, T = E.UPSTASH_REDIS_REST_TOKEN || E.KV_REST_API_TOKEN;
import fs from "node:fs";
const FILE = new URL("../.data.json", import.meta.url);
const mem = globalThis.__st || (globalThis.__st = (() => { try { return JSON.parse(fs.readFileSync(FILE)); } catch { return {}; } })());
const persist = () => { if (!hasDb) try { fs.writeFileSync(FILE, JSON.stringify(mem)); } catch {} };

export const hasDb = !!(U && T);
const redis = async cmd => (await (await fetch(U, { method: "POST", headers: { Authorization: `Bearer ${T}` }, body: JSON.stringify(cmd) })).json()).result;
export const db = {
  async hset(k, f, v) { hasDb ? await redis(["HSET", k, f, JSON.stringify(v)]) : ((mem[k] ??= {})[f] = v, persist()); },
  async hall(k) { if (!hasDb) return mem[k] || {}; const a = (await redis(["HGETALL", k])) || [], o = {}; for (let i = 0; i < a.length; i += 2) o[a[i]] = JSON.parse(a[i + 1]); return o; },
  async claim(k, ttl) { if (!hasDb) { if (mem[k]) return false; mem[k] = 1; persist(); return true; } return (await redis(["SET", k, "1", "NX", "EX", ttl])) === "OK"; },
  async release(k) { hasDb ? await redis(["DEL", k]) : (delete mem[k], persist()); },
};

// Provider priority:
// 1. Meta Cloud API        → WHATSAPP_TOKEN + WHATSAPP_PHONE_ID
// 2. Green API             → GREENAPI_ID_INSTANCE + GREENAPI_TOKEN   ← NEW (free, personal WhatsApp)
// 3. CallMeBot             → CALLMEBOT_APIKEY                        (personal only, legacy)
// 4. Twilio                → TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN
export const provider = () => (
  E.WHATSAPP_TOKEN && E.WHATSAPP_PHONE_ID ? "meta"
  : E.GREENAPI_ID_INSTANCE && E.GREENAPI_TOKEN ? "greenapi"
  : E.CALLMEBOT_APIKEY ? "callmebot"
  : E.TWILIO_ACCOUNT_SID && E.TWILIO_AUTH_TOKEN ? "twilio"
  : null
);

const norm = p => { let d = String(p || "").replace(/[^\d+]/g, ""); if (/^\d{10}$/.test(d)) d = "+91" + d; else if (!d.startsWith("+")) d = "+" + d; return d; };

const HINTS = {
  131030: "Test mode: add this number under WhatsApp > API Setup > 'To' (verify it once), then retry.",
  132001: "Template not found/approved. Create template 'subtrack_reminder' (see README) and wait for approval.",
  132000: "Template variable count mismatch - the template body must use {{1}}..{{5}}.",
  131047: "Outside the 24h window - free text isn't allowed; reminders must use the approved template.",
  190: "Access token expired - create a permanent System User token (see README).",
  63015: "Number hasn't joined the Twilio sandbox: send 'join <code>' to +1 415 523 8886.",
  21211: "Invalid phone number - use +91XXXXXXXXXX.",
};

// vars = [platform, plan, when, price, autopayText] → used by Meta template; `message` is plain-text fallback/default
export async function sendWhatsApp(to, message, vars) {
  const p = provider();
  if (!p) return { ok: false, error: "No WhatsApp provider configured on the server.", hint: "Set GREENAPI_ID_INSTANCE + GREENAPI_TOKEN in .env (free at green-api.com)." };
  const num = norm(to);

  // ── 1. Meta Cloud API ────────────────────────────────────────────────────────
  if (p === "meta") {
    const payload = vars
      ? { type: "template", template: { name: E.WHATSAPP_TEMPLATE || "subtrack_reminder", language: { code: E.WHATSAPP_TEMPLATE_LANG || "en" }, components: [{ type: "body", parameters: vars.map(t => ({ type: "text", text: String(t) })) }] } }
      : { type: "text", text: { body: message } };
    const r = await fetch(`https://graph.facebook.com/${E.META_GRAPH_VERSION || "v21.0"}/${E.WHATSAPP_PHONE_ID}/messages`, { method: "POST", headers: { Authorization: `Bearer ${E.WHATSAPP_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to: num.slice(1), ...payload }) }).then(r => r.json());
    return r.messages ? { ok: true, status: "accepted" } : { ok: false, error: r.error?.message || "Meta rejected the request", code: r.error?.code, hint: HINTS[r.error?.code] };
  }

  // ── 2. Green API (free, uses your personal WhatsApp) ─────────────────────────
  // Sign up at https://green-api.com → create Developer instance (free) → scan QR code with WhatsApp
  if (p === "greenapi") {
    // chatId format: country_code + number + "@c.us"  (no leading +)
    const chatId = num.replace("+", "") + "@c.us";
    const url = `https://api.green-api.com/waInstance${E.GREENAPI_ID_INSTANCE}/sendMessage/${E.GREENAPI_TOKEN}`;
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, message }),
      }).then(r => r.json());
      // Green API returns { idMessage: "..." } on success
      return r.idMessage
        ? { ok: true, status: "sent", idMessage: r.idMessage }
        : { ok: false, error: r.message || JSON.stringify(r), hint: "Check GREENAPI_ID_INSTANCE and GREENAPI_TOKEN in .env, and that your WhatsApp instance is authorised (QR scanned)." };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  // ── 3. CallMeBot (legacy, personal only) ────────────────────────────────────
  if (p === "callmebot") {
    const r = await fetch("https://api.callmebot.com/whatsapp.php?" + new URLSearchParams({ phone: num, text: message, apikey: E.CALLMEBOT_APIKEY }));
    const t = (await r.text()).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return r.ok && !/error|invalid|incorrect|not (activated|allowed)/i.test(t)
      ? { ok: true, status: "queued - CallMeBot can take up to a minute" }
      : { ok: false, error: t.slice(0, 200) || "CallMeBot error", hint: "Check CALLMEBOT_APIKEY." };
  }

  // ── 4. Twilio WhatsApp Sandbox ───────────────────────────────────────────────
  const auth = "Basic " + Buffer.from(`${E.TWILIO_ACCOUNT_SID}:${E.TWILIO_AUTH_TOKEN}`).toString("base64"), base = `https://api.twilio.com/2010-04-01/Accounts/${E.TWILIO_ACCOUNT_SID}`;
  const m = await fetch(`${base}/Messages.json`, { method: "POST", headers: { Authorization: auth, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ To: "whatsapp:" + num, From: E.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886", Body: message }) }).then(r => r.json());
  if (!m.sid) return { ok: false, error: m.message, code: m.code, hint: HINTS[m.code] };
  await new Promise(r => setTimeout(r, 2500));
  const s = await fetch(`${base}/Messages/${m.sid}.json`, { headers: { Authorization: auth } }).then(r => r.json());
  return ["failed", "undelivered"].includes(s.status) ? { ok: false, error: s.error_message || s.status, code: s.error_code, hint: HINTS[s.error_code] } : { ok: true, status: s.status };
}

// ── SMS via Fast2SMS (India) ───────────────────────────────────────────────────
// Uses the "q" (Quick SMS) route, same as the OTP flow. Needs a Fast2SMS account with a recharge.
export const hasSms = () => !!E.FAST2SMS_KEY;
export async function sendSMS(to, message) {
  if (!E.FAST2SMS_KEY) return { ok: false, channel: "sms", error: "FAST2SMS_KEY not configured", hint: "Set FAST2SMS_KEY in .env (Fast2SMS > Dev API)." };
  // keep only the last 10 digits (handles "+91 77150 27101", "91771...", "0771...")
  const num = String(to || "").replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(num)) return { ok: false, channel: "sms", error: "Invalid Indian mobile number: " + (to || "(empty)") };
  try {
    const r = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: { authorization: E.FAST2SMS_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ route: "q", message, numbers: num, flash: 0 }),
    }).then(r => r.json());
    return r.return === true
      ? { ok: true, channel: "sms", status: "queued" }
      : { ok: false, channel: "sms", error: (Array.isArray(r.message) ? r.message[0] : r.message) || "Fast2SMS error", hint: "Check FAST2SMS_KEY and your Fast2SMS wallet balance (Quick SMS needs a recharge)." };
  } catch (e) { return { ok: false, channel: "sms", error: e.message }; }
}

// ── Automatic renewal reminders: 7 days, 3 days and 1 day before ──────────────
// Stage = the reminder bucket a renewal is currently in:  4-7 days -> 7,  2-3 days -> 3,  1 day -> 1.
// WhatsApp + SMS are always sent (no per-subscription tick needed). Each (user, subscription, renewal date, stage, channel) is sent once. If the server was off on the
// exact day, the missed stage still goes out on the next run (e.g. "renews in 6 days").
export const stageFor = days => (days > 7 || days < 1 ? null : days > 3 ? 7 : days > 1 ? 3 : 1);
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: E.TZ_NAME || "Asia/Kolkata" }).format(new Date());
const inr = n => "₹" + Number(n).toLocaleString("en-IN");

export async function runReminders({ today: t, dry } = {}) {
  const out = [], d0 = Date.parse(t || today()), users = await db.hall("subtrack:users");
  const waOn = !!provider(), smsOn = hasSms();
  for (const [uid, u] of Object.entries(users)) for (const s of u.subs || []) {
    const days = Math.round((Date.parse(s.renewal) - d0) / 864e5), stage = stageFor(days);
    if (!stage) continue;
    const when = days === 1 ? "tomorrow" : `in ${days} days`, price = inr(s.price);
    const ap = s.autopay ? "Auto-pay is ON." : "Auto-pay is OFF - renew manually.";
    const jobs = [
      ["WhatsApp", waOn && u.whatsapp, u.whatsapp, (to, m) => sendWhatsApp(to, m, [s.platform, s.plan, when, price, ap]), `🔔 SubTrack: your ${s.platform} ${s.plan} plan renews ${when} for ${price}. ${ap}`],
      ["SMS", smsOn && (u.phone || u.whatsapp), u.phone || u.whatsapp, sendSMS, `SubTrack: your ${s.platform} ${s.plan} plan renews ${when} for ${price}. ${ap}`],
    ];
    for (const [name, enabled, to, send, msg] of jobs) {
      const row = { sub: s.platform, channel: name, stage, days };
      if (!enabled) { out.push({ ...row, ok: false, error: name === "SMS" ? (smsOn ? "no phone number saved" : "FAST2SMS_KEY not set") : (waOn ? "no WhatsApp number saved" : "no WhatsApp provider configured") }); continue; }
      const k = `subtrack:sent:${uid}:${s.id}:${s.renewal}:d${stage}:${name}`;
      if (dry) { out.push({ ...row, ok: true, dry: true, to }); continue; }
      if (!(await db.claim(k, 60 * 864e2))) continue;     // already sent for this stage
      let r; try { r = await send(to, msg); } catch (e) { r = { ok: false, error: e.message }; }
      if (!r.ok) await db.release(k);                      // retry on the next run
      out.push({ ...row, ...r });
    }
  }
  return out;
}
