const GEMINI_ENDPOINT = '/.netlify/functions/gemini'

function networkErrorMessage() {
  if (import.meta.env.DEV) {
    return (
      'Cannot reach Hope Assistant. Stop the server and run npm run dev (Netlify Dev on port 8888), ' +
      'not npm run dev:vite alone. Open http://localhost:8888 and ensure GEMINI_API_KEY is in .env.'
    )
  }
  return (
    'Cannot reach Hope Assistant. Redeploy the site so Netlify Functions are included, ' +
    'and set GEMINI_API_KEY (not VITE_GEMINI_API_KEY) in Netlify environment variables.'
  )
}

export async function sendHopeMessage(userMessage, history = []) {
  let response
  try {
    response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })
  } catch {
    throw new Error(networkErrorMessage())
  }

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        (response.status === 503
          ? 'Hope Assistant is not configured. Add GEMINI_API_KEY on Netlify (no VITE_ prefix).'
          : 'Something went wrong. Please try again.')
    )
  }

  if (!data.reply) {
    throw new Error('No response from Hope Assistant.')
  }

  return data.reply
}
