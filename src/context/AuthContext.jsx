import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'
import { useFirebase } from './FirebaseContext'
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut as authSignOut,
  getAuthDisplayName,
  completeGoogleRedirectSignIn,
  getAuthErrorMessage,
} from '../services/authService'
import { migrateLocalEntriesToFirestore } from '../services/journalMigrationService'
import { runLegacyStoryMigration } from '../lib/legacyStorage'

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isGuest: true,
  authLoading: true,
  authError: null,
  showAuthModal: false,
  showLogoutPrompt: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInGoogle: async () => {},
  signInEmail: async () => {},
  signUpEmail: async () => {},
  signOut: async () => {},
  continueAsGuest: () => {},
  dismissLogoutPrompt: () => {},
  displayName: 'Guest',
})

export function AuthProvider({ children }) {
  const { firebaseReady, loading: firebaseLoading } = useFirebase()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false)
  const [isGuest, setIsGuest] = useState(true)

  useEffect(() => {
    if (!firebaseReady) {
      if (!firebaseLoading) setAuthLoading(false)
      return
    }

    const auth = getFirebaseAuth()

    completeGoogleRedirectSignIn()
      .then((redirectUser) => {
        if (redirectUser) {
          setIsGuest(false)
          setShowAuthModal(false)
        }
      })
      .catch((err) => {
        const message = getAuthErrorMessage(err)
        if (message) setAuthError(message)
      })

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Clear legacy anonymous sessions — journal guest mode uses localStorage instead
      if (currentUser?.isAnonymous) {
        await firebaseSignOut(auth)
        return
      }

      setUser(currentUser)
      setIsGuest(!currentUser)
      setAuthLoading(false)

      if (currentUser) {
        setShowLogoutPrompt(false)
        try {
          await migrateLocalEntriesToFirestore(currentUser.uid)
          await runLegacyStoryMigration(currentUser.uid)
        } catch {
          // migration runs again on next sign-in
        }
      }
    })

    return () => unsubscribe()
  }, [firebaseReady, firebaseLoading])

  const openAuthModal = useCallback(() => {
    setAuthError(null)
    setShowAuthModal(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false)
    setAuthError(null)
  }, [])

  const continueAsGuest = useCallback(() => {
    setIsGuest(true)
    closeAuthModal()
  }, [closeAuthModal])

  const handleSignIn = useCallback(
    async (action) => {
      setAuthError(null)
      try {
        const result = await action()
        if (result) {
          setIsGuest(false)
          closeAuthModal()
        }
      } catch (err) {
        const message = getAuthErrorMessage(err)
        if (message) setAuthError(message)
        throw err
      }
    },
    [closeAuthModal]
  )

  const signInGoogle = useCallback(
    () => handleSignIn(signInWithGoogle),
    [handleSignIn]
  )

  const signInEmail = useCallback(
    (email, password) => handleSignIn(() => signInWithEmail(email, password)),
    [handleSignIn]
  )

  const signUpEmail = useCallback(
    (email, password, displayName) =>
      handleSignIn(() => signUpWithEmail(email, password, displayName)),
    [handleSignIn]
  )

  const signOut = useCallback(async () => {
    setAuthError(null)
    try {
      await authSignOut()
      setIsGuest(true)
      setShowLogoutPrompt(true)
    } catch {
      setAuthError('Sign out could not be completed. Please try again.')
    }
  }, [])

  const dismissLogoutPrompt = useCallback(() => {
    setShowLogoutPrompt(false)
  }, [])

  const isAuthenticated = Boolean(user && !user.isAnonymous)

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest: isGuest || !isAuthenticated,
        authLoading: authLoading || firebaseLoading,
        authError,
        showAuthModal,
        showLogoutPrompt,
        openAuthModal,
        closeAuthModal,
        signInGoogle,
        signInEmail,
        signUpEmail,
        signOut,
        continueAsGuest,
        dismissLogoutPrompt,
        displayName: getAuthDisplayName(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
