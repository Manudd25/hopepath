import {
  fetchJournalEntries,
  saveJournalEntry,
} from './journalFirestoreService'
import {
  getAllUnmigratedLocalEntries,
  markLocalEntriesMigrated,
  isMigrationComplete,
  markMigrationComplete,
  removePendingSyncEntry,
  getPendingSyncEntries,
} from './journalLocalService'

function entriesMatch(a, b) {
  return (
    a.entryDate === b.entryDate &&
    a.fear === b.fear &&
    a.gratitude === b.gratitude &&
    a.tomorrowGoal === b.tomorrowGoal
  )
}

function isDuplicate(existing, localEntry) {
  if (localEntry.id && existing.some((e) => e.localEntryId === localEntry.id)) {
    return true
  }
  return existing.some((e) => entriesMatch(e, localEntry))
}

export async function migrateLocalEntriesToFirestore(userId) {
  const localEntries = getAllUnmigratedLocalEntries()
  if (!localEntries.length && isMigrationComplete(userId)) {
    return { migrated: 0, skipped: 0 }
  }

  const existing = await fetchJournalEntries(userId)
  let migrated = 0
  let skipped = 0
  const migratedIds = []

  for (const localEntry of localEntries) {
    if (isDuplicate(existing, localEntry)) {
      skipped += 1
      migratedIds.push(localEntry.id)
      continue
    }

    const firestoreId = await saveJournalEntry(userId, {
      ...localEntry,
      localEntryId: localEntry.id,
    })

    existing.push({
      ...localEntry,
      id: firestoreId,
      firestoreId,
      localEntryId: localEntry.id,
    })
    migratedIds.push(localEntry.id)
    migrated += 1
  }

  if (migratedIds.length) {
    markLocalEntriesMigrated(migratedIds)
  }

  const remaining = getAllUnmigratedLocalEntries()
  if (remaining.length === 0) {
    markMigrationComplete(userId)
  }

  return { migrated, skipped }
}

export async function syncPendingEntries(userId) {
  const pending = getPendingSyncEntries()
  if (!pending.length) return { synced: 0, failed: 0 }

  const existing = await fetchJournalEntries(userId)
  let synced = 0
  let failed = 0

  for (const entry of pending) {
    try {
      if (isDuplicate(existing, entry)) {
        removePendingSyncEntry(entry.id)
        continue
      }

      const firestoreId = await saveJournalEntry(userId, {
        ...entry,
        localEntryId: entry.id,
      })

      existing.unshift({ ...entry, id: firestoreId, firestoreId })
      removePendingSyncEntry(entry.id)
      synced += 1
    } catch {
      failed += 1
    }
  }

  return { synced, failed }
}
