import { getStore } from '@netlify/blobs'
import { getDailyPrayer, isValidDateKey } from '../lib/dailyPrayerCore.mjs'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=3600',
}

export default async (request) => {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: JSON_HEADERS,
    })
  }

  const url = new URL(request.url)
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)

  if (!isValidDateKey(date)) {
    return new Response(JSON.stringify({ error: 'Invalid date. Use YYYY-MM-DD.' }), {
      status: 400,
      headers: JSON_HEADERS,
    })
  }

  try {
    const store = getStore('daily-prayers')
    const prayer = await getDailyPrayer(date, process.env, store)
    return new Response(JSON.stringify(prayer), { status: 200, headers: JSON_HEADERS })
  } catch (err) {
    console.error('daily-prayer function error:', err)
    return new Response(
      JSON.stringify({ error: 'Unable to load daily prayer. Please try again.' }),
      { status: 500, headers: JSON_HEADERS }
    )
  }
}
