// server/local.js — Express-style mirror of all Vercel serverless functions for local dev.
// Run: npm start   (Vite on :5174 + this server on :3001, proxied by vite.config.js)
import http from "node:http";
import fs   from "node:fs";

// ── Load .env ──────────────────────────────────────────────────────────────────
try {
  for (const l of fs.readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

// ── Import API handlers (after .env loaded) ────────────────────────────────────
const { runReminders, provider, hasSms } = await import("../lib/core.js");
const routes = {
  "notify":        (await import("../api/notify.js")).default,
  "send-otp":      (await import("../api/send-otp.js")).default,
  "sync":          (await import("../api/sync.js")).default,
  "status":        (await import("../api/status.js")).default,
  "scheduler/run": async (q, s) => { const u = new URL(q.url, "http://x"); s.status(200).json({ sent: await runReminders({ dry: u.searchParams.has("dry"), today: u.searchParams.get("date") || undefined }) }); },
};

// ── HTTP server ────────────────────────────────────────────────────────────────
http.createServer(async (req, res) => {
  // helpers to match Vercel's res interface
  res.status = c => { res.statusCode = c; return res; };
  res.json   = o => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // parse body
  let body = "";
  for await (const chunk of req) body += chunk;
  try { req.body = JSON.parse(body); } catch { req.body = {}; }

  const key = req.url.replace(/^\/api\//, "").split("?")[0];
  const handler = routes[key];
  try {
    handler ? await handler(req, res) : res.status(404).json({ error: `No route: /api/${key}` });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}).listen(3001, () => {
  const wp = provider() || "NONE ← set GREENAPI_ID_INSTANCE + GREENAPI_TOKEN in .env";
  const sms = process.env.FAST2SMS_KEY ? "Fast2SMS ✓" : "NONE ← set FAST2SMS_KEY in .env";
  console.log("\n┌──────────────────────────────────────────────────────┐");
  console.log("│  SubTrack local API  →  http://localhost:3001          │");
  console.log("├──────────────────────────────────────────────────────┤");
  console.log(`│  WhatsApp : ${wp.padEnd(41)}│`);
  console.log(`│  SMS      : ${sms.padEnd(41)}│`);
  console.log("└──────────────────────────────────────────────────────┘\n");
});

// ── Auto-reminder scheduler (runs every minute, sends between REMIND_HOUR and REMIND_HOUR+1) ──
const HOUR = +(process.env.REMIND_HOUR ?? 9);
const tick = async () => {
  const h = +new Intl.DateTimeFormat("en-GB", { timeZone: process.env.TZ_NAME || "Asia/Kolkata", hour: "2-digit", hourCycle: "h23" }).format(new Date());
  if (h >= HOUR && (provider() || hasSms())) {
    const r = await runReminders();
    if (r.length) console.log("[auto-reminders]", r);
  }
};
setInterval(() => tick().catch(console.error), 60_000);
setTimeout(() => tick().catch(console.error), 3_000); // run 3s after boot
