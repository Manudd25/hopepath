import {
  isHopeAssistantConfigured,
  runHopeAssistant,
} from '../lib/hopeAssistantCore.mjs'

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

  if (!isHopeAssistantConfigured()) {
    return jsonResponse(request, 503, {
      error:
        'Hope Assistant is not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN on Netlify.',
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

  try {
    const reply = await runHopeAssistant({ message, history })
    return jsonResponse(request, 200, { reply })
  } catch (err) {
    console.error('Hope Assistant error:', err)

    const msg = err.message || ''
    if (msg.includes('not configured')) {
      return jsonResponse(request, 503, { error: msg })
    }
    if (msg.includes('429') || msg.toLowerCase().includes('rate')) {
      return jsonResponse(request, 429, {
        error: 'Hope Assistant is busy right now. Please wait a moment and try again.',
      })
    }

    return jsonResponse(request, 500, {
      error: 'Unable to reach Hope Assistant right now. Please try again shortly.',
    })
  }
}
