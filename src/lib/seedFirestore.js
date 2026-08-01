import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { getFirebaseDb, isFirebaseConfigured } from './firebase'
import { stories as localStories } from '../data/stories'

/** One-time dev seed: stories collection from static data when empty */
export async function seedStoriesIfEmpty(shouldSeed = false) {
  if (!shouldSeed || !isFirebaseConfigured()) return false

  const db = getFirebaseDb()
  const snap = await getDocs(collection(db, 'stories'))
  if (!snap.empty) return false

  await Promise.all(
    localStories.map((story, index) =>
      setDoc(doc(db, 'stories', `story-${index}`), {
        ...story,
        published: true,
        createdAt: new Date().toISOString(),
      })
    )
  )
  return true
}
