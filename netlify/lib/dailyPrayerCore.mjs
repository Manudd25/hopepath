import { runCloudflareChat, isCloudflareConfigured } from './cloudflareAi.mjs'
import { dailyPrayers } from '../../src/data/dailyContent.js'

const devCache = new Map()

const GENERATION_PROMPT = `You write the daily prayer for Hope Path, a gentle Christian encouragement website.
Tone: peaceful, warm, non-judgmental. Never preach aggressively. Feel like "a quiet light during difficult times."

Return ONLY valid JSON (no markdown) with exactly these keys:
- "verse": Bible reference only (e.g. "Psalm 23:1")
- "verseText": the verse text — do not use double-quote characters inside this string
- "reflection": 2-3 short sentences of gentle encouragement
- "prayer": a short personal prayer ending with "Amen."

Use real Bible verses. Vary themes: hope, peace, strength, new beginnings, fear, gratitude, rest, trust.`

const PRAYER_KEYS = ['verse', 'verseText', 'reflection', 'prayer']

function extractJsonStringValue(block, key, nextKey) {
  const keyMatch = block.match(new RegExp(`"${key}"\\s*:\\s*`))
  if (!keyMatch) return null

  let pos = keyMatch.index + keyMatch[0].length
  while (pos < block.length && /\s/.test(block[pos])) pos += 1
  if (block[pos] !== '"') return null
  pos += 1

  let value = ''
  while (pos < block.length) {
    const char = block[pos]
    if (char === '\\') {
      const next = block[pos + 1]
      if (next === undefined) break
      value += next === 'n' ? '\n' : next === 't' ? '\t' : next
      pos += 2
      continue
    }
    if (char === '"') {
      const rest = block.slice(pos + 1).trimStart()
      if (rest.startsWith(',') || rest.startsWith('}')) break
      if (nextKey && rest.startsWith(`"${nextKey}"`)) break
      value += '"'
      pos += 1
      continue
    }
    value += char
    pos += 1
  }

  return value.trim() || null
}

function parsePrayerJson(text) {
  let trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) trimmed = fenced[1].trim()

  const block = trimmed.match(/\{[\s\S]*\}/)?.[0] ?? trimmed

  try {
    return JSON.parse(block)
  } catch {
    const result = {}
    for (let i = 0; i < PRAYER_KEYS.length; i += 1) {
      const key = PRAYER_KEYS[i]
      const nextKey = PRAYER_KEYS[i + 1]
      const value = extractJsonStringValue(block, key, nextKey)
      if (!value) throw new Error(`Could not parse field: ${key}`)
      result[key] = value
    }
    return result
  }
}

export function isValidDateKey(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

export function getDayIndexForDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const start = new Date(year, 0, 0)
  const current = new Date(year, month - 1, day)
  return Math.floor((current - start) / (1000 * 60 * 60 * 24))
}

function fallbackPrayer(date) {
  const idx = getDayIndexForDate(date)
  const prayer = dailyPrayers[idx % dailyPrayers.length]
  return {
    ...prayer,
    date,
    source: 'fallback',
  }
}

function validatePrayer(raw) {
  for (const key of ['verse', 'verseText', 'reflection', 'prayer']) {
    if (typeof raw[key] !== 'string' || !raw[key].trim()) {
      throw new Error(`Missing field: ${key}`)
    }
  }
  return {
    verse: raw.verse.trim(),
    verseText: raw.verseText.trim(),
    reflection: raw.reflection.trim(),
    prayer: raw.prayer.trim(),
  }
}

export async function generateDailyPrayer(date, env = process.env) {
  const dayIndex = getDayIndexForDate(date)
  const raw = await runCloudflareChat({
    env,
    maxTokens: 650,
    messages: [
      { role: 'system', content: GENERATION_PROMPT },
      {
        role: 'user',
        content: `Write today's unique daily prayer for calendar date ${date} (day ${dayIndex} of the year). Make it distinct from other days.`,
      },
    ],
  })

  const prayer = validatePrayer(parsePrayerJson(raw))
  return { ...prayer, date, source: 'ai' }
}

export async function getDailyPrayer(date, env = process.env, blobStore = null) {
  if (!isValidDateKey(date)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD.')
  }

  if (blobStore) {
    const cached = await blobStore.get(date, { type: 'json' })
    if (cached?.verse && cached?.prayer) {
      return { ...cached, date, source: cached.source || 'cache' }
    }
  } else if (devCache.has(date)) {
    return devCache.get(date)
  }

  if (!isCloudflareConfigured(env)) {
    return fallbackPrayer(date)
  }

  try {
    const prayer = await generateDailyPrayer(date, env)
    if (blobStore) {
      await blobStore.setJSON(date, prayer)
    } else {
      devCache.set(date, prayer)
    }
    return prayer
  } catch (err) {
    console.error('Daily prayer generation failed:', err.message)
    return fallbackPrayer(date)
  }
}
