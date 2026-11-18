# LandMark — site

Static site (HTML/CSS/JS) + one Vercel function for leads.

## Pages
- `/` — LandMark home (about the platform)
- `/alburouj` — Al Burouj (IMKAN) landing page
- `/thank-you` — after form submit (noindex) — fire conversion here
- `/privacy-policy` — AR / EN

## Edit data
- Prices / units / payment plans / gallery: `assets/js/data.js`
- WhatsApp number: `SITE_CONFIG.whatsappNumber` in `assets/js/data.js`

## Leads (Resend)
Form → `POST /api/lead` (`api/lead.js`) → email via Resend → redirect to `/thank-you`.
Captures UTM + GCLID/GBRAID/WBRAID (first touch per session).

Vercel → Settings → Environment Variables:
- `RESEND_API_KEY` — required
- `LEAD_TO` — required, comma-separated emails
- `LEAD_FROM` — optional (default `LandMark Leads <leads@leads.mohabdo.com>`)

## Deploy
Push this folder to GitHub → import in Vercel (no build step). `vercel.json` enables clean URLs.
Do not upload source files (original PNGs, PDF, zip, BulkResizePhotos.com) — see `.gitignore`.
