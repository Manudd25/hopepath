# Hope Assistant (disabled)

The `gemini.mjs` function is not deployed while AI is off the site.

To re-enable:

1. Uncomment `functions = "netlify/functions"` in `netlify.toml`
2. Add route + nav link in `App.jsx` and `Navbar.jsx`
3. Set `GEMINI_API_KEY` on Netlify (never `VITE_GEMINI_API_KEY`)
4. Redeploy
