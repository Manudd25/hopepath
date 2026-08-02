import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'

function journalEntriesRef(userId) {
  return collection(getFirebaseDb(), 'users', userId, 'journalEntries')
}

function legacyJournalRef(userId) {
  return collection(getFirebaseDb(), 'users', userId, 'journal')
}

function toIso(value) {
  if (!value) return new Date().toISOString()
  if (typeof value === 'string') return value
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (value?.toDate) return value.toDate().toISOString()
  return new Date().toISOString()
}

function mapFirestoreEntry(id, data) {
  return {
    id,
    fear: data.fear || '',
    gratitude: data.gratitude || '',
    tomorrowGoal: data.tomorrowGoal || data.goal || '',
    entryDate: data.entryDate || '',
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    localEntryId: data.localEntryId || null,
  }
}

export async function fetchJournalEntries(userId) {
  const q = query(journalEntriesRef(userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => mapFirestoreEntry(d.id, d.data()))
}

export async function saveJournalEntry(userId, entry) {
  const isLocalId = entry.id?.toString().startsWith('local-')
  const entryId =
    entry.firestoreId ||
    (entry.id && !isLocalId ? entry.id.toString() : null) ||
    doc(journalEntriesRef(userId)).id
  const ref = doc(getFirebaseDb(), 'users', userId, 'journalEntries', entryId)
  const isNew = !entry.firestoreId && (isLocalId || !entry.id)

  const payload = {
    fear: entry.fear || '',
    gratitude: entry.gratitude || '',
    tomorrowGoal: entry.tomorrowGoal || '',
    entryDate: entry.entryDate,
    localEntryId: entry.localEntryId || (isLocalId ? entry.id : null),
    updatedAt: serverTimestamp(),
  }

  if (isNew) {
    payload.createdAt = serverTimestamp()
  }

  await setDoc(ref, payload, { merge: true })
  return entryId
}

export async function deleteJournalEntry(userId, entryId) {
  await deleteDoc(doc(getFirebaseDb(), 'users', userId, 'journalEntries', entryId))
}

export async function fetchLegacyJournalEntries(userId) {
  try {
    const q = query(legacyJournalRef(userId), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return mapFirestoreEntry(d.id, {
        ...data,
        tomorrowGoal: data.goal,
        entryDate: data.entryDate || inferLegacyEntryDate(data),
        localEntryId: null,
      })
    })
  } catch {
    return []
  }
}

function inferLegacyEntryDate(data) {
  if (data.entryDate) return data.entryDate
  if (data.date && /^\d{4}-\d{2}-\d{2}$/.test(data.date)) return data.date
  if (data.createdAt) {
    const iso = toIso(data.createdAt)
    return iso.slice(0, 10)
  }
  return new Date().toISOString().slice(0, 10)
}

export async function migrateLegacyFirestoreEntries(userId, existingEntries) {
  const legacy = await fetchLegacyJournalEntries(userId)
  if (!legacy.length) return existingEntries

  const merged = [...existingEntries]
  for (const entry of legacy) {
    const duplicate = merged.some(
      (e) =>
        e.entryDate === entry.entryDate &&
        e.fear === entry.fear &&
        e.gratitude === entry.gratitude &&
        e.tomorrowGoal === entry.tomorrowGoal
    )
    if (!duplicate) {
      const firestoreId = await saveJournalEntry(userId, entry)
      merged.push({ ...entry, id: firestoreId, firestoreId })
    }
  }

  return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
