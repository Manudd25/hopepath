import { getTodaysPrayer } from '../data/dailyContent'

function localDateKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function fetchTodaysPrayer() {
  const date = localDateKey()

  try {
    const response = await fetch(`/.netlify/functions/daily-prayer?date=${date}`)
    const data = await response.json()

    if (response.ok && data?.verse && data?.prayer) {
      return data
    }
  } catch {
    // fall through to static prayers
  }

  return { ...getTodaysPrayer(), date, source: 'fallback' }
}
