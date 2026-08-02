import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'

const googleProvider = new GoogleAuthProvider()

export function getAuthDisplayName(user) {
  if (!user) return 'Guest'
  return user.displayName || user.email || 'Account'
}

export function getAuthErrorMessage(err) {
  switch (err?.code) {
    case 'auth/unauthorized-domain':
      return 'Google sign-in is not set up for hopepath.net yet. In Firebase Console → Authentication → Settings → Authorized domains, add hopepath.net.'
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. In Firebase Console → Authentication → Sign-in method, turn on Google.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in window. Please allow popups for this site, or try again — we will use a full-page sign-in instead.'
    case 'auth/invalid-credential':
      return 'Email or password is incorrect. Please try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/weak-password':
      return 'Please choose a password with at least 6 characters.'
    case 'auth/popup-closed-by-user':
      return null
    default:
      return 'Sign in could not be completed. Please try again.'
  }
}

export async function completeGoogleRedirectSignIn() {
  const auth = getFirebaseAuth()
  const result = await getRedirectResult(auth)
  return result?.user ?? null
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth()

  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (err) {
    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/cancelled-popup-request'
    ) {
      await signInWithRedirect(auth, googleProvider)
      return null
    }
    throw err
  }
}

export async function signInWithEmail(email, password) {
  const auth = getFirebaseAuth()
  const result = await signInWithEmailAndPassword(auth, email.trim(), password)
  return result.user
}

export async function signUpWithEmail(email, password, displayName) {
  const auth = getFirebaseAuth()
  const result = await createUserWithEmailAndPassword(auth, email.trim(), password)
  if (displayName?.trim()) {
    await updateProfile(result.user, { displayName: displayName.trim() })
  }
  return result.user
}

export async function signOut() {
  const auth = getFirebaseAuth()
  await firebaseSignOut(auth)
}
