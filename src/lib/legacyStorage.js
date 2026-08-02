import { migrateLocalStories } from '../services/storiesService'

const STORIES_KEY = 'hopepath-my-stories'
const MIGRATED_KEY = 'hopepath-legacy-stories-migrated'

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function wasLegacyStoriesMigrated(uid) {
  return localStorage.getItem(`${MIGRATED_KEY}-${uid}`) === '1'
}

/** One-time import of pre-Firebase stories from localStorage after sign-in */
export async function runLegacyStoryMigration(userId) {
  if (wasLegacyStoriesMigrated(userId)) return

  const stories = readJson(STORIES_KEY)
  if (stories.length > 0) {
    await migrateLocalStories(userId, stories)
  }

  localStorage.setItem(`${MIGRATED_KEY}-${userId}`, '1')
  localStorage.removeItem(STORIES_KEY)
}
