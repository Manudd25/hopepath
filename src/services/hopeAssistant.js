const HOPE_ASSISTANT_ENDPOINT = '/.netlify/functions/hope-assistant'

export async function sendHopeMessage(userMessage, history = []) {
  let response
  try {
    response = await fetch(HOPE_ASSISTANT_ENDPOINT, {
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
    throw new Error(
      'Cannot reach Hope Assistant. Redeploy the site and ensure Cloudflare credentials are set on the server.'
    )
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
          ? 'Hope Assistant is not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN on Netlify.'
          : 'Something went wrong. Please try again.')
    )
  }

  if (!data.reply) {
    throw new Error('No response from Hope Assistant.')
  }

  return data.reply
}
