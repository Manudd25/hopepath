import { createContext, useContext, useEffect, useState } from 'react'
import { initFirebase, isFirebaseConfigured } from '../lib/firebase'
import { loadPublicConfig } from '../lib/publicConfig'
import { initAnalytics } from '../lib/analytics'
import { seedStoriesIfEmpty } from '../lib/seedFirestore'

const FirebaseContext = createContext({
  firebaseReady: false,
  loading: true,
  configError: null,
})

export function FirebaseProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [configError, setConfigError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function bootstrap() {
      try {
        const config = await loadPublicConfig()
        initAnalytics(config.gaMeasurementId)
        await initFirebase(config)

        if (isFirebaseConfigured()) {
          setReady(true)
          try {
            await seedStoriesIfEmpty(config.seedFirestore)
          } catch {
            // optional seed
          }
        }
      } catch (err) {
        setConfigError(err.message)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        firebaseReady: ready && !loading,
        loading,
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
