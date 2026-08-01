import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'
import { stories as fallbackStories } from '../data/stories'

function mapStoryDoc(id, data) {
  return {
    id,
    name: data.name || 'Anonymous',
    struggle: data.struggle || '',
    helped: data.helped || '',
    verse: data.verse || '',
    verseText: data.verseText || '',
    authorId: data.authorId || null,
    published: data.published !== false,
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  }
}

export function getBuiltInStoriesOnly() {
  return fallbackStories.map((s, i) => ({
    ...s,
    id: `builtin-${i}`,
    authorId: null,
    isOwner: false,
    isBuiltIn: true,
    createdAt: '',
  }))
}

function builtInStories() {
  return getBuiltInStoriesOnly()
}

function storyKey(story) {
  return `${story.name}|${story.verse}`
}

export async function fetchStories(currentUserId = null) {
  const builtIn = builtInStories()

  const snap = await getDocs(collection(getFirebaseDb(), 'stories'))

  const fromFirestore = snap.docs
    .map((d) => mapStoryDoc(d.id, d.data()))
    .filter((story) => story.published !== false)
    .map((story) => ({
      ...story,
      isOwner: Boolean(currentUserId && story.authorId === currentUserId),
      isBuiltIn: false,
    }))

  const firestoreKeys = new Set(fromFirestore.map(storyKey))
  const uniqueBuiltIn = builtIn.filter((s) => !firestoreKeys.has(storyKey(s)))

  return [...fromFirestore, ...uniqueBuiltIn].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return b.createdAt.localeCompare(a.createdAt)
    }
    if (a.createdAt) return -1
    if (b.createdAt) return 1
    return 0
  })
}

export async function createStory(userId, story) {
  const id = `story-${Date.now()}`
  const ref = doc(getFirebaseDb(), 'stories', id)
  const now = new Date().toISOString()
  await setDoc(ref, {
    name: story.name.trim() || 'Anonymous',
    struggle: story.struggle.trim(),
    helped: story.helped.trim(),
    verse: story.verse.trim(),
    verseText: story.verseText.trim(),
    authorId: userId,
    published: true,
    createdAt: now,
    updatedAt: now,
  })
  return id
}

export async function updateStory(storyId, story) {
  const ref = doc(getFirebaseDb(), 'stories', storyId)
  const now = new Date().toISOString()
  await setDoc(
    ref,
    {
      name: story.name.trim() || 'Anonymous',
      struggle: story.struggle.trim(),
      helped: story.helped.trim(),
      verse: story.verse.trim(),
      verseText: story.verseText.trim(),
      updatedAt: now,
    },
    { merge: true }
  )
}

export async function deleteStory(storyId) {
  await deleteDoc(doc(getFirebaseDb(), 'stories', storyId))
}

export async function migrateLocalStories(userId, localStories) {
  const existing = await fetchStories(userId)
  const existingKeys = new Set(existing.map(storyKey))

  for (const story of localStories) {
    const payload = {
      name: story.name || 'Anonymous',
      struggle: story.struggle || '',
      helped: story.helped || '',
      verse: story.verse || '',
      verseText: story.verseText || '',
    }
    if (!existingKeys.has(storyKey(payload))) {
      await createStory(userId, payload)
      existingKeys.add(storyKey(payload))
    }
  }
}
