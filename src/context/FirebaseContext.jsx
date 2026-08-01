import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import {
  initFirebase,
  isFirebaseConfigured,
  getFirebaseAuth,
} from '../lib/firebase'
import { loadPublicConfig } from '../lib/publicConfig'
import { initAnalytics } from '../lib/analytics'
import { seedStoriesIfEmpty } from '../lib/seedFirestore'
import { runLegacyMigration } from '../lib/legacyStorage'

const FirebaseContext = createContext({
  user: null,
  loading: true,
  firebaseReady: false,
  authError: null,
  configError: null,
})

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [configError, setConfigError] = useState(null)

  useEffect(() => {
    let unsubscribe = () => {}

    async function bootstrap() {
      try {
        const config = await loadPublicConfig()
        initAnalytics(config.gaMeasurementId)
        await initFirebase(config)

        if (!isFirebaseConfigured()) {
          setLoading(false)
          return
        }

        const auth = getFirebaseAuth()

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            setUser(currentUser)
            setLoading(false)
            try {
              await runLegacyMigration(currentUser.uid)
              await seedStoriesIfEmpty(config.seedFirestore)
            } catch {
              // optional
            }
            return
          }

          try {
            const credential = await signInAnonymously(auth)
            setUser(credential.user)
            setAuthError(null)
            try {
              await runLegacyMigration(credential.user.uid)
              await seedStoriesIfEmpty(config.seedFirestore)
            } catch {
              // optional
            }
          } catch (err) {
            setAuthError(err.message)
          } finally {
            setLoading(false)
          }
        })
      } catch (err) {
        setConfigError(err.message)
        setLoading(false)
      }
    }

    bootstrap()

    return () => unsubscribe()
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        firebaseReady: isFirebaseConfigured() && !loading && Boolean(user),
        authError,
        configError,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  return useContext(FirebaseContext)
}
