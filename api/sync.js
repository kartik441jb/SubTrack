import { db } from "../lib/core.js";
export default async function handler(req, res) {
  const { userId, subs, whatsapp, phone } = req.body || {};
  if (!userId) return res.status(400).json({ ok: false });
  await db.hset("subtrack:users", String(userId).slice(0, 80), {
    subs: (subs || []).slice(0, 100),
    whatsapp,
    phone,
  });
  res.status(200).json({ ok: true });
}
