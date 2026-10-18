// /api/send-otp  — sends a 6-digit OTP via WhatsApp (CallMeBot) AND SMS (Fast2SMS)
// Both are free for India. No OTP is stored server-side — the client holds it (demo-grade security).
import { sendWhatsApp, sendSMS } from "../../SubTrack-Prototype/lib/core.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "POST only" });

  const { phone, otp } = req.body || {};
  if (!phone || !otp)
    return res.status(400).json({ ok: false, error: "phone and otp required" });

  const msg = `Your SubTrack verification code is ${otp}. Valid for 10 minutes. Do NOT share it.`;
  const results = await Promise.allSettled([
    // 1 — WhatsApp via CallMeBot / Meta / Twilio (whatever is configured)
    sendWhatsApp(phone, `🔐 SubTrack OTP: *${otp}*\n${msg}`).then((r) => ({
      ...r,
      channel: "whatsapp",
    })),
    // 2 — SMS via Fast2SMS (India, free tier)
    sendSMS(phone, msg),
  ]);

  const out = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { ok: false, error: r.reason?.message },
  );
  const anyOk = out.some((r) => r.ok);
  res.status(200).json({ ok: anyOk, results: out });
}
