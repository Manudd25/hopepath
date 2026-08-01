# Hope Path

A gentle space of hope for people facing uncertainty, fear, burnout, and new beginnings.

## Tech Stack

- React + Vite
- Tailwind CSS v4
- React Router
- Firebase (Firestore + Anonymous Auth)
- Cloudflare Workers AI (Hope Assistant — server-side only)

## Local development

```bash
npm install
cp .env.example .env   # fill in Firebase keys
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deploy to Netlify (no GitHub — keep the project private)

Your code stays on your computer. Only the built site (`dist`) is uploaded to Netlify.

### One-time setup

```bash
npm install -g netlify-cli
netlify login
netlify init
```

When prompted:

- **Create & configure a new site**
- Pick a site name (e.g. `hope-path`)
- Build command: `npm run build` (from `netlify.toml`)
- Publish directory: `dist`

Then in [Netlify](https://app.netlify.com) → your site → **Site configuration → Environment variables**, add:

| Variable | Required | Notes |
|----------|----------|--------|
| `FIREBASE_API_KEY` | Yes | **No `VITE_` prefix** — served via Netlify Function, not in JS bundle |
| `FIREBASE_AUTH_DOMAIN` | Yes | |
| `FIREBASE_PROJECT_ID` | Yes | |
| `FIREBASE_STORAGE_BUCKET` | Yes | |
| `FIREBASE_MESSAGING_SENDER_ID` | Yes | |
| `FIREBASE_APP_ID` | Yes | |
| `GA_MEASUREMENT_ID` | Optional | Analytics |
| `SEED_FIRESTORE` | `false` in production | Dev seed only |
| `CLOUDFLARE_ACCOUNT_ID` | For Hope AI & Daily Prayer | Server only |
| `CLOUDFLARE_API_TOKEN` | For Hope AI & Daily Prayer | Workers AI token |
| `CLOUDFLARE_AI_MODEL` | Optional | e.g. `@cf/meta/llama-3.1-8b-instruct` |

**Never use `VITE_` for secrets.** Vite embeds every `VITE_*` variable in the public JavaScript file. This project loads Firebase config from `/.netlify/functions/config` instead.

Delete old `VITE_FIREBASE_*` and `VITE_GA_*` vars from Netlify if they still exist.

### Deploy (each time you update the site)

```bash
netlify deploy --prod --build
```

Netlify builds on their servers using your env vars — your repo never touches GitHub.

### Alternative: build locally, upload only `dist`

```bash
npm run build
netlify deploy --prod --dir=dist --functions=netlify/functions
```

You still need Firebase env vars on Netlify for the `config` function at runtime.

---

## After deploy — Firebase & API keys

### Firebase authorized domains

1. [Firebase Console](https://console.firebase.google.com) → your project → **Authentication** → **Settings** → **Authorized domains**.
2. Add your Netlify URL, e.g. `your-site-name.netlify.app` (and your custom domain later).

### Restrict API keys (production)

**Firebase API key** — [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → your key → **HTTP referrers**:

- `http://localhost:5173/*`
- `https://your-site-name.netlify.app/*`
- `https://your-custom-domain.com/*`

### Firestore rules

Publish `firestore.rules` from this repo (Firebase Console → Firestore → Rules, or `firebase deploy --only firestore:rules`).

---

## Google Analytics (when you're ready)

Analytics is **optional** and only runs when `GA_MEASUREMENT_ID` is set on Netlify / in `.env`.

1. Create a property at [Google Analytics](https://analytics.google.com) (GA4).
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Add to Netlify env vars (and local `.env` if you want):

   ```env
   GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. Redeploy the site. Page views are tracked on each route change.

No code changes needed — the app already loads GA when that variable exists.

---

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/feelings` | Emotional check-in |
| `/feelings/:id` | Support content per feeling |
| `/daily-prayer` | Daily prayer (unique each day via Cloudflare AI) |
| `/small-steps` | Small steps |
| `/stories` | Stories of hope |
| `/journal` | Private journal |
| `/peace-corner` | Breathing & calm |
| `/hope-assistant` | Hope AI (Cloudflare Workers AI) |
| `/resources` | Resources |
| `/about` | About |
