import { initializeApp } from 'firebase/app'
import { getAuth as createAuth } from 'firebase/auth'
import { getFirestore as createFirestore } from 'firebase/firestore'

let app = null
let auth = null
let db = null
let configured = false

export function isFirebaseConfigured() {
  return configured
}

export function getFirebaseAuth() {
  if (!auth) {
    throw new Error('Firebase is not initialized yet.')
  }
  return auth
}

export function getFirebaseDb() {
  if (!db) {
    throw new Error('Firebase is not initialized yet.')
  }
  return db
}

export async function initFirebase(publicConfig) {
  const firebaseConfig = publicConfig?.firebase

  if (
    !firebaseConfig?.apiKey ||
    !firebaseConfig?.projectId ||
    !firebaseConfig?.appId
  ) {
    configured = false
    return false
  }

  app = initializeApp(firebaseConfig)
  auth = createAuth(app)
  db = createFirestore(app)
  configured = true
  return true
}
