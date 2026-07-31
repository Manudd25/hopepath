import { migrateLocalJournal } from '../services/journalService'
import { migrateLocalStories } from '../services/storiesService'

const JOURNAL_KEY = 'hopepath-journal'
const STORIES_KEY = 'hopepath-my-stories'
const MIGRATED_KEY = 'hopepath-legacy-migrated'
const OLD_JOURNAL_MIGRATED_KEY = 'hopepath-journal-migrated'

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function wasLegacyMigrated() {
  return (
    sessionStorage.getItem(MIGRATED_KEY) === '1' ||
    sessionStorage.getItem(OLD_JOURNAL_MIGRATED_KEY) === '1'
  )
}

function markLegacyMigrated() {
  sessionStorage.setItem(MIGRATED_KEY, '1')
  sessionStorage.removeItem(OLD_JOURNAL_MIGRATED_KEY)
  localStorage.removeItem(JOURNAL_KEY)
  localStorage.removeItem(STORIES_KEY)
}

/** One-time import of pre-Firebase journal + stories from localStorage */
export async function runLegacyMigration(userId) {
  if (wasLegacyMigrated()) return

  const journal = readJson(JOURNAL_KEY)
  const stories = readJson(STORIES_KEY)

  if (journal.length > 0) {
    await migrateLocalJournal(userId, journal)
  }
  if (stories.length > 0) {
    await migrateLocalStories(userId, stories)
  }

  markLegacyMigrated()
}
