# Hope Path — Netlify Functions

## `config.mjs` (required)

Serves Firebase + analytics at `GET /.netlify/functions/config`.

Env vars (no `VITE_` prefix): `FIREBASE_*`, `GA_MEASUREMENT_ID`, `SEED_FIRESTORE`.

## `daily-prayer.mjs` (Daily Prayer page)

Generates a **unique prayer per calendar day** using Cloudflare Workers AI.

- First visitor of the day triggers generation (then cached in Netlify Blobs).
- Same prayer for everyone on that date; a new one each day → 365+ unique days per year.
- Uses the same Cloudflare env vars as Hope AI.

## `hope-assistant.mjs` (Hope AI)

Uses **Cloudflare Workers AI** from the server.

Env vars on Netlify and in `.env`:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_AI_MODEL` (optional, default `@cf/meta/llama-3.1-8b-instruct`)

Create token: Cloudflare Dashboard → **Workers AI** → **Use REST API**.
