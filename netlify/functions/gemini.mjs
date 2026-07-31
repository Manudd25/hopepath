import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are the Hope Assistant for Hope Path, a gentle Christian encouragement website.
Your tone is peaceful, warm, non-judgmental, and emotionally safe. Never preach aggressively.
You help people facing uncertainty, fear, burnout, financial stress, and new beginnings.

When someone shares how they feel:
- Acknowledge their feeling with compassion
- Offer to share: a short prayer, a Bible verse, or one small practical step for today
- Keep responses concise (2-4 short paragraphs max)
- Do not replace professional mental health care — gently note that if someone seems in crisis

Do not use harsh religious language. Feel like "a quiet light during difficult times."`

const JSON_HEADERS = { 'Content-Type': 'application/json' }

function corsHeaders(request) {
  const origin = request.headers.get('origin') || ''
  const allowed = new Set(
    [
      process.env.URL,
      process.env.DEPLOY_PRIME_URL,
      'http://localhost:8888',
      'http://localhost:5173',
      'https://hopepath.net',
      'https://www.hopepath.net',
    ].filter(Boolean)
  )

  const headers = { ...JSON_HEADERS }
  if (origin && allowed.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Vary'] = 'Origin'
  }
  headers['Access-Control-Allow-Headers'] = 'Content-Type'
  headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
  return headers
}

function jsonResponse(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(request),
  })
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) })
  }

  if (request.method !== 'POST') {
    return jsonResponse(request, 405, { error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return jsonResponse(request, 503, {
      error: 'Hope Assistant is not configured on the server.',
    })
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return jsonResponse(request, 400, { error: 'Invalid JSON body' })
  }

  const message = payload?.message
  const history = Array.isArray(payload?.history) ? payload.history : []

  if (typeof message !== 'string' || !message.trim()) {
    return jsonResponse(request, 400, { error: 'Message is required' })
  }

  if (message.length > 2000) {
    return jsonResponse(request, 400, { error: 'Message is too long' })
  }

  const safeHistory = history
    .slice(-10)
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length <= 4000
    )
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
    })

    const chat = model.startChat({ history: safeHistory })
    const result = await chat.sendMessage(message.trim())
    const reply = result.response.text()

    return jsonResponse(request, 200, { reply })
  } catch (err) {
    console.error('Gemini function error:', err)

    const status = err?.status
    const reason = err?.errorDetails?.[0]?.reason || ''

    if (status === 403 || reason === 'CONSUMER_SUSPENDED') {
      return jsonResponse(request, 503, {
        error:
          'The Gemini API key is blocked or suspended by Google. Create a new key in Google AI Studio and update GEMINI_API_KEY in Netlify and your local .env.',
      })
    }

    if (status === 429) {
      return jsonResponse(request, 429, {
        error: 'Hope Assistant is busy right now. Please wait a moment and try again.',
      })
    }

    return jsonResponse(request, 500, {
      error: 'Unable to reach Hope Assistant right now. Please try again shortly.',
    })
  }
}
