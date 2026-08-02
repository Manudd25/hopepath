const ENTRIES_KEY = 'hopepath-journal-entries'
const INFO_DISMISSED_KEY = 'hopepath-journal-info-dismissed'
const PENDING_SYNC_KEY = 'hopepath-journal-pending-sync'
const LEGACY_KEY = 'hopepath-journal'

export const FIELD_LIMITS = {
  fear: 2000,
  gratitude: 1000,
  tomorrowGoal: 500,
}

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

export function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatEntryDisplayDate(entryDate) {
  if (!entryDate) return ''
  const [year, month, day] = entryDate.split('-').map(Number)
  if (!year || !month || !day) return entryDate
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function normalizeLocalEntry(entry) {
  const now = new Date().toISOString()
  const entryDate = entry.entryDate || localDateKey()
  return {
    id: entry.id || `local-${Date.now()}`,
    fear: (entry.fear || '').trim(),
    gratitude: (entry.gratitude || '').trim(),
    tomorrowGoal: (entry.tomorrowGoal || entry.goal || '').trim(),
    entryDate,
    createdAt: entry.createdAt || now,
    updatedAt: entry.updatedAt || now,
    pendingSync: Boolean(entry.pendingSync),
    firestoreId: entry.firestoreId || null,
  }
}

export function validateJournalFields({ fear = '', gratitude = '', tomorrowGoal = '' }) {
  const trimmed = {
    fear: fear.trim(),
    gratitude: gratitude.trim(),
    tomorrowGoal: tomorrowGoal.trim(),
  }

  if (!trimmed.fear && !trimmed.gratitude && !trimmed.tomorrowGoal) {
    return { valid: false, message: 'Please write at least one reflection before saving.' }
  }

  if (trimmed.fear.length > FIELD_LIMITS.fear) {
    return { valid: false, message: `Today's fear can be at most ${FIELD_LIMITS.fear} characters.` }
  }
  if (trimmed.gratitude.length > FIELD_LIMITS.gratitude) {
    return { valid: false, message: `Gratitude can be at most ${FIELD_LIMITS.gratitude} characters.` }
  }
  if (trimmed.tomorrowGoal.length > FIELD_LIMITS.tomorrowGoal) {
    return { valid: false, message: `Tomorrow's goal can be at most ${FIELD_LIMITS.tomorrowGoal} characters.` }
  }

  return { valid: true, fields: trimmed }
}

export function isInfoCardDismissed() {
  return localStorage.getItem(INFO_DISMISSED_KEY) === '1'
}

export function dismissInfoCard() {
  localStorage.setItem(INFO_DISMISSED_KEY, '1')
}

export function getGuestEntries() {
  const entries = readJson(ENTRIES_KEY, [])
  return entries.map(normalizeLocalEntry).sort(sortByNewest)
}

export function saveGuestEntry(fields) {
  const validation = validateJournalFields(fields)
  if (!validation.valid) {
    throw new Error(validation.message)
  }

  const now = new Date().toISOString()
  const entry = normalizeLocalEntry({
    id: `local-${Date.now()}`,
    ...validation.fields,
    entryDate: localDateKey(),
    createdAt: now,
    updatedAt: now,
  })

  const entries = getGuestEntries()
  entries.unshift(entry)
  writeJson(ENTRIES_KEY, entries)
  return entry
}

export function deleteGuestEntry(entryId) {
  const entries = getGuestEntries().filter((e) => e.id !== entryId)
  writeJson(ENTRIES_KEY, entries)
}

export function updateGuestEntry(entryId, fields) {
  const validation = validateJournalFields(fields)
  if (!validation.valid) {
    throw new Error(validation.message)
  }

  const entries = getGuestEntries()
  const index = entries.findIndex((e) => e.id === entryId)
  if (index === -1) {
    throw new Error('Entry not found.')
  }

  entries[index] = normalizeLocalEntry({
    ...entries[index],
    ...validation.fields,
    updatedAt: new Date().toISOString(),
  })
  writeJson(ENTRIES_KEY, entries)
  return entries[index]
}

export function getPendingSyncEntries() {
  return readJson(PENDING_SYNC_KEY, []).map(normalizeLocalEntry)
}

export function savePendingSyncEntry(entry) {
  const normalized = normalizeLocalEntry({ ...entry, pendingSync: true })
  const pending = getPendingSyncEntries().filter((e) => e.id !== normalized.id)
  pending.unshift(normalized)
  writeJson(PENDING_SYNC_KEY, pending)
  return normalized
}

export function removePendingSyncEntry(entryId) {
  const pending = getPendingSyncEntries().filter((e) => e.id !== entryId)
  writeJson(PENDING_SYNC_KEY, pending)
}

export function clearGuestEntries() {
  localStorage.removeItem(ENTRIES_KEY)
}

export function getLegacyGuestEntries() {
  const legacy = readJson(LEGACY_KEY, [])
  return legacy.map((entry) =>
    normalizeLocalEntry({
      id: entry.id ? `local-${entry.id}` : `local-${Date.now()}`,
      fear: entry.fear,
      gratitude: entry.gratitude,
      tomorrowGoal: entry.goal,
      entryDate: entry.entryDate || inferEntryDate(entry),
      createdAt: entry.createdAt || new Date(entry.id || Date.now()).toISOString(),
      updatedAt: entry.updatedAt || new Date(entry.id || Date.now()).toISOString(),
    })
  )
}

function inferEntryDate(entry) {
  if (entry.entryDate) return entry.entryDate
  if (entry.date && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)) return entry.date
  if (entry.id && typeof entry.id === 'number') return localDateKey(new Date(entry.id))
  return localDateKey()
}

export function getAllUnmigratedLocalEntries() {
  const current = getGuestEntries()
  const legacy = getLegacyGuestEntries()
  const seen = new Set()
  const merged = []

  for (const entry of [...current, ...legacy]) {
    const key = `${entry.entryDate}|${entry.fear}|${entry.gratitude}|${entry.tomorrowGoal}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(entry)
  }

  return merged.sort(sortByNewest)
}

function sortByNewest(a, b) {
  const aTime = new Date(a.createdAt || 0).getTime()
  const bTime = new Date(b.createdAt || 0).getTime()
  return bTime - aTime
}

export function markLocalEntriesMigrated(migratedIds) {
  if (!migratedIds?.length) return

  const idSet = new Set(migratedIds)
  const remaining = getGuestEntries().filter((e) => !idSet.has(e.id))
  writeJson(ENTRIES_KEY, remaining)
  localStorage.removeItem(LEGACY_KEY)
}

export function migrationFlagKey(uid) {
  return `hopepath-journal-migrated-${uid}`
}

export function isMigrationComplete(uid) {
  return localStorage.getItem(migrationFlagKey(uid)) === '1'
}

export function markMigrationComplete(uid) {
  localStorage.setItem(migrationFlagKey(uid), '1')
}
