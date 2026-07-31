import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { seedStoriesIfEmpty } from '../lib/seedFirestore'
import { runLegacyMigration } from '../lib/legacyStorage'

const FirebaseContext = createContext({
  user: null,
  loading: true,
  firebaseReady: false,
  authError: null,
})

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured())
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setLoading(false)
        try {
          await runLegacyMigration(currentUser.uid)
          await seedStoriesIfEmpty()
        } catch {
          // seed / migration are optional
        }
        return
      }

      try {
        const credential = await signInAnonymously(auth)
        setUser(credential.user)
        setAuthError(null)
        try {
          await runLegacyMigration(credential.user.uid)
          await seedStoriesIfEmpty()
        } catch {
          // seed / migration are optional
        }
      } catch (err) {
        setAuthError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        firebaseReady: isFirebaseConfigured() && !loading && Boolean(user),
        authError,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  return useContext(FirebaseContext)
}
