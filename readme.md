# SubTrack (local)

1. `cp .env.example .env` and set `FAST2SMS_KEY`, `GREENAPI_ID_INSTANCE`, `GREENAPI_TOKEN`.
2. `npm install && npm start` and keep the terminal open.

## Automatic reminders
- Sent over **WhatsApp (Green API)** and **SMS (Fast2SMS)**, for each channel ticked on a subscription.
- Fires **7 days, 3 days and 1 day** before the renewal date, once per stage per channel.
- The local server checks every minute and sends after `REMIND_HOUR` (default 9, `TZ_NAME` timezone). If the server was off on the exact day, the missed stage goes out on the next run.
- Phone numbers reach the server when the app is open (it syncs subscriptions + numbers), so open the app once after changing anything.

## Testing without waiting
- `GET http://localhost:3001/api/scheduler/run?dry=1` lists what would be sent today (nothing is sent).
- `...?dry=1&date=2026-11-10` pretends it is that date.
- `GET http://localhost:3001/api/scheduler/run` sends for real.

## Vercel
`vercel.json` runs `/api/cron` daily at 03:30 UTC (9:00 IST). On Vercel add an Upstash Redis store, otherwise subscription data and "already sent" flags are not saved between runs.
