import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'

function journalRef(userId) {
  return collection(getFirebaseDb(), 'users', userId, 'journal')
}

export async function fetchJournalEntries(userId) {
  const q = query(journalRef(userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function saveJournalEntry(userId, entry) {
  const id = entry.id?.toString() || `entry-${Date.now()}`
  const ref = doc(getFirebaseDb(), 'users', userId, 'journal', id)
  await setDoc(ref, {
    fear: entry.fear || '',
    gratitude: entry.gratitude || '',
    goal: entry.goal || '',
    date: entry.date,
    createdAt: entry.createdAt || new Date().toISOString(),
  })
  return id
}

export async function deleteJournalEntry(userId, entryId) {
  await deleteDoc(doc(getFirebaseDb(), 'users', userId, 'journal', entryId))
}

export async function migrateLocalJournal(userId, localEntries) {
  const existing = await fetchJournalEntries(userId)
  const existingDates = new Set(existing.map((e) => e.date))

  for (const entry of localEntries) {
    if (!existingDates.has(entry.date)) {
      await saveJournalEntry(userId, {
        ...entry,
        createdAt: new Date(entry.id || Date.now()).toISOString(),
      })
    }
  }
}
