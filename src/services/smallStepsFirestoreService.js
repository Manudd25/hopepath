import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'

function smallStepsRef(userId) {
  return collection(getFirebaseDb(), 'users', userId, 'smallSteps')
}

function toIso(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (value?.toDate) return value.toDate().toISOString()
  return null
}

function mapFirestoreStep(date, data) {
  return {
    stepId: data.stepId || '',
    text: data.text || '',
    category: data.category || '',
    date,
    completed: Boolean(data.completed),
    createdAt: toIso(data.createdAt) || new Date().toISOString(),
    completedAt: toIso(data.completedAt),
  }
}

export async function fetchSmallSteps(userId) {
  const snap = await getDocs(smallStepsRef(userId))
  const steps = snap.docs.map((d) => mapFirestoreStep(d.id, d.data()))
  return steps.sort((a, b) => b.date.localeCompare(a.date))
}

export async function fetchSmallStep(userId, date) {
  const steps = await fetchSmallSteps(userId)
  return steps.find((s) => s.date === date) || null
}

export async function saveSmallStep(userId, record) {
  const ref = doc(getFirebaseDb(), 'users', userId, 'smallSteps', record.date)
  const snap = await getDoc(ref)
  const isNew = !snap.exists()

  const payload = {
    stepId: record.stepId,
    text: record.text,
    category: record.category,
    date: record.date,
    completed: Boolean(record.completed),
    updatedAt: serverTimestamp(),
  }

  if (record.completed) {
    payload.completedAt = serverTimestamp()
  } else {
    payload.completedAt = null
  }

  if (isNew) {
    payload.createdAt = serverTimestamp()
    await setDoc(ref, payload)
  } else {
    await setDoc(ref, payload, { merge: true })
  }

  return record.date
}

export async function deleteSmallStep(userId, date) {
  await deleteDoc(doc(getFirebaseDb(), 'users', userId, 'smallSteps', date))
}

export async function fetchRecentSmallSteps(userId, limit = 7) {
  const steps = await fetchSmallSteps(userId)
  return steps.slice(0, limit)
}
