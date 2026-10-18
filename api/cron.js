import { runReminders } from "../../SubTrack-Prototype/lib/core.js";
// Called daily by Vercel Cron (see vercel.json). Vercel sends "Authorization: Bearer $CRON_SECRET".
export default async function handler(req, res) {
  if (
    process.env.CRON_SECRET &&
    req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
  )
    return res.status(401).json({ error: "unauthorized" });
  res.status(200).json({ sent: await runReminders() });
}
