# Hope Path

A gentle space of hope for people facing uncertainty, fear, burnout, and new beginnings.

## Tech Stack

- React + Vite
- Tailwind CSS v4
- React Router
- Firebase (Firestore + Anonymous Auth)

Hope Assistant (Gemini AI) is **disabled** on the site to avoid API cost. Code remains in the repo if you want to turn it on later.

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
| `VITE_FIREBASE_*` (6 vars) | Yes | Safe in frontend — restrict by domain in Google Cloud |
| `VITE_GA_MEASUREMENT_ID` | Optional | Analytics |
| `VITE_SEED_FIRESTORE` | `false` in production | Dev seed only |

No `GEMINI_API_KEY` needed while Hope Assistant is off. Remove it from Netlify env vars too.

### Deploy (each time you update the site)

```bash
netlify deploy --prod --build
```

Netlify builds on their servers using your env vars — your repo never touches GitHub.

### Alternative: build locally, upload only `dist`

If you prefer not to store env vars on Netlify:

```bash
npm run build          # uses your local .env
netlify deploy --prod --dir=dist
```

Firebase keys are embedded in the JS bundle (normal for client apps). Restrict them by domain in Google Cloud Console.

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

Analytics is **optional** and only runs when `VITE_GA_MEASUREMENT_ID` is set.

1. Create a property at [Google Analytics](https://analytics.google.com) (GA4).
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Add to Netlify env vars (and local `.env` if you want):

   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
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
| `/daily-prayer` | Daily prayer |
| `/small-steps` | Small steps |
| `/stories` | Stories of hope |
| `/journal` | Private journal |
| `/peace-corner` | Breathing & calm |
| `/resources` | Resources |
| `/about` | About |
