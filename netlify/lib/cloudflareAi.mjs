const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct'

function extractCloudflareReply(result) {
  if (!result) return null

  const { response, choices } = result

  if (typeof response === 'string' && response.trim()) {
    return response.trim()
  }

  if (response && typeof response === 'object' && !Array.isArray(response)) {
    return JSON.stringify(response)
  }

  const choiceContent = choices?.[0]?.message?.content
  if (typeof choiceContent === 'string' && choiceContent.trim()) {
    return choiceContent.trim()
  }

  return null
}

export async function runCloudflareChat({ messages, env = process.env, maxTokens = 512 }) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = env.CLOUDFLARE_API_TOKEN
  const model = env.CLOUDFLARE_AI_MODEL || DEFAULT_MODEL

  if (!accountId || !apiToken) {
    throw new Error('Cloudflare AI is not configured.')
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      max_tokens: maxTokens,
      temperature: 0.75,
    }),
  })

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok || data.success === false) {
    const detail =
      data.errors?.[0]?.message ||
      data.messages?.[0]?.message ||
      `Cloudflare AI error (${response.status})`
    throw new Error(detail)
  }

  const reply = extractCloudflareReply(data.result)
  if (!reply) {
    throw new Error('Empty response from Cloudflare AI.')
  }

  return reply
}

export function isCloudflareConfigured(env = process.env) {
  return Boolean(env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_API_TOKEN)
}
