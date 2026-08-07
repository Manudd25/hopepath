import { fetchSmallSteps, saveSmallStep } from './smallStepsFirestoreService'
import {
  getAllUnmigratedLocalSmallSteps,
  markLocalSmallStepsMigrated,
  isSmallStepsMigrationComplete,
  markSmallStepsMigrationComplete,
  getPendingSyncSmallSteps,
  removePendingSyncSmallStep,
} from './smallStepsLocalService'

function recordsMatch(a, b) {
  return a.date === b.date && a.stepId === b.stepId
}

export async function migrateLocalSmallStepsToFirestore(userId) {
  const localSteps = getAllUnmigratedLocalSmallSteps()
  if (!localSteps.length && isSmallStepsMigrationComplete(userId)) {
    return { migrated: 0, skipped: 0 }
  }

  const existing = await fetchSmallSteps(userId)
  let migrated = 0
  let skipped = 0
  const migratedDates = []

  for (const localStep of localSteps) {
    const firestoreRecord = existing.find((e) => e.date === localStep.date)
    if (firestoreRecord) {
      skipped += 1
      migratedDates.push(localStep.date)
      continue
    }

    await saveSmallStep(userId, localStep)
    existing.unshift(localStep)
    migratedDates.push(localStep.date)
    migrated += 1
  }

  if (migratedDates.length) {
    markLocalSmallStepsMigrated(migratedDates)
  }

  const remaining = getAllUnmigratedLocalSmallSteps()
  if (remaining.length === 0) {
    markSmallStepsMigrationComplete(userId)
  }

  return { migrated, skipped }
}

export async function syncPendingSmallSteps(userId) {
  const pending = getPendingSyncSmallSteps()
  if (!pending.length) return { synced: 0, failed: 0 }

  const existing = await fetchSmallSteps(userId)
  let synced = 0
  let failed = 0

  for (const record of pending) {
    try {
      const firestoreRecord = existing.find((e) => e.date === record.date)
      if (firestoreRecord && !recordsMatch(firestoreRecord, record)) {
        removePendingSyncSmallStep(record.date)
        continue
      }

      if (firestoreRecord) {
        removePendingSyncSmallStep(record.date)
        continue
      }

      await saveSmallStep(userId, record)
      existing.unshift(record)
      removePendingSyncSmallStep(record.date)
      synced += 1
    } catch {
      failed += 1
    }
  }

  return { synced, failed }
}
