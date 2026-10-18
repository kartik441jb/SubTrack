import { sendWhatsApp, sendSMS } from "../lib/core.js";
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "POST only" });
  const { channel, to, message, vars } = req.body || {};
  try {
    if (channel === "whatsapp")
      return res.status(200).json(await sendWhatsApp(to, message, vars));
    if (channel === "sms")
      return res
        .status(200)
        .json(await sendSMS(to, String(message || "").replace(/^🔔\s*/, "")));
    res.status(200).json({ ok: false, error: "Unknown channel: " + channel });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
