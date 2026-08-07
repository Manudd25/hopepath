import { localDateKey } from './journalLocalService'

export const STORAGE_KEY = 'hopepath_small_steps'
const PENDING_SYNC_KEY = 'hopepath-small-steps-pending-sync'
const DAILY_META_KEY = 'hopepath-small-steps-daily-meta'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function normalizeSmallStep(record) {
  const now = new Date().toISOString()
  return {
    stepId: record.stepId || '',
    text: record.text || '',
    category: record.category || '',
    date: record.date || localDateKey(),
    completed: Boolean(record.completed),
    createdAt: record.createdAt || now,
    completedAt: record.completedAt || null,
    pendingSync: Boolean(record.pendingSync),
  }
}

export function getAllLocalSmallSteps() {
  const store = readJson(STORAGE_KEY, {})
  return Object.entries(store).map(([date, record]) => normalizeSmallStep({ ...record, date }))
}

export function getLocalSmallStep(date = localDateKey()) {
  const store = readJson(STORAGE_KEY, {})
  if (!store[date]) return null
  return normalizeSmallStep({ ...store[date], date })
}

export function saveLocalSmallStep(record) {
  const normalized = normalizeSmallStep(record)
  const store = readJson(STORAGE_KEY, {})
  store[normalized.date] = normalized
  writeJson(STORAGE_KEY, store)
  return normalized
}

export function deleteLocalSmallStep(date = localDateKey()) {
  const store = readJson(STORAGE_KEY, {})
  delete store[date]
  writeJson(STORAGE_KEY, store)
}

export function getDailyRefreshMeta(date = localDateKey()) {
  const meta = readJson(DAILY_META_KEY, {})
  return meta[date] || { spiritual: 0, emotional: 0, practical: 0 }
}

export function incrementDailyRefresh(categoryId, date = localDateKey()) {
  const meta = readJson(DAILY_META_KEY, {})
  const dayMeta = meta[date] || { spiritual: 0, emotional: 0, practical: 0 }
  dayMeta[categoryId] = (dayMeta[categoryId] || 0) + 1
  meta[date] = dayMeta
  writeJson(DAILY_META_KEY, meta)
  return dayMeta[categoryId]
}

export function getPendingSyncSmallSteps() {
  return readJson(PENDING_SYNC_KEY, []).map(normalizeSmallStep)
}

export function savePendingSyncSmallStep(record) {
  const normalized = normalizeSmallStep({ ...record, pendingSync: true })
  const pending = getPendingSyncSmallSteps().filter((r) => r.date !== normalized.date)
  pending.unshift(normalized)
  writeJson(PENDING_SYNC_KEY, pending)
  return normalized
}

export function removePendingSyncSmallStep(date) {
  const pending = getPendingSyncSmallSteps().filter((r) => r.date !== date)
  writeJson(PENDING_SYNC_KEY, pending)
}

export function getAllUnmigratedLocalSmallSteps() {
  return getAllLocalSmallSteps().sort((a, b) => b.date.localeCompare(a.date))
}

export function markLocalSmallStepsMigrated(dates) {
  if (!dates?.length) return

  const dateSet = new Set(dates)
  const store = readJson(STORAGE_KEY, {})
  for (const date of dateSet) {
    delete store[date]
  }
  writeJson(STORAGE_KEY, store)
}

export function smallStepsMigrationFlagKey(uid) {
  return `hopepath-small-steps-migrated-${uid}`
}

export function isSmallStepsMigrationComplete(uid) {
  return localStorage.getItem(smallStepsMigrationFlagKey(uid)) === '1'
}

export function markSmallStepsMigrationComplete(uid) {
  localStorage.setItem(smallStepsMigrationFlagKey(uid), '1')
}

export { localDateKey }
