import { STEP_POOLS } from '../data/smallSteps'

const STEPS_PER_DAY = 3

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function seededShuffle(items, seed) {
  const arr = [...items]
  let state = seed

  for (let i = arr.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    const j = state % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

export function pickDailySteps(categoryId, dateKey, refreshSeed = 0) {
  const pool = STEP_POOLS[categoryId]
  if (!pool?.length) return []

  const seed = hashString(`${dateKey}-${categoryId}-${refreshSeed}`)
  const shuffled = seededShuffle(pool, seed)
  return shuffled.slice(0, Math.min(STEPS_PER_DAY, shuffled.length))
}

export function formatShortDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  if (!year || !month || !day) return dateKey
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function sortStepsByDateDesc(records) {
  return [...records].sort((a, b) => b.date.localeCompare(a.date))
}

export const CUSTOM_STEP_MAX_LENGTH = 120

export function isCustomStep(stepId) {
  return typeof stepId === 'string' && stepId.startsWith('custom-')
}

export function createCustomStepId() {
  return `custom-${Date.now()}`
}

export function validateCustomStepText(text) {
  const trimmed = text.trim()
  if (!trimmed) {
    return { valid: false, message: 'Please write your small step.' }
  }
  if (trimmed.length < 2) {
    return { valid: false, message: 'Your step needs at least 2 characters.' }
  }
  if (trimmed.length > CUSTOM_STEP_MAX_LENGTH) {
    return {
      valid: false,
      message: `Please keep your step under ${CUSTOM_STEP_MAX_LENGTH} characters.`,
    }
  }
  return { valid: true, text: trimmed }
}
