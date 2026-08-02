import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal() {
  const {
    showAuthModal,
    closeAuthModal,
    signInGoogle,
    signInEmail,
    signUpEmail,
    authError,
    continueAsGuest,
  } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!showAuthModal) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        await signInEmail(email, password)
      } else {
        await signUpEmail(email, password, displayName)
      }
    } catch {
      // error shown via authError
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setSubmitting(true)
    try {
      await signInGoogle()
    } catch {
      // error shown via authError
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-cream border border-sand shadow-lg p-8">
        <h2 id="auth-modal-title" className="font-display text-2xl text-navy">
          Sign in to Hope Path
        </h2>
        <p className="mt-2 text-sm text-navy/70 leading-relaxed">
          Securely sync your journal across your devices. Your entries stay private to you.
        </p>

        {authError && (
          <p className="mt-4 text-sm text-rose-800 bg-rose/30 rounded-xl p-3 border border-rose">
            {authError}
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="mt-6 w-full py-3 rounded-full border border-sand bg-sand/30 text-navy text-sm font-medium hover:bg-sand/50 transition-colors disabled:opacity-50"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-sand" />
          <span className="text-xs text-navy/50">or</span>
          <span className="flex-1 h-px bg-sand" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <label className="block">
              <span className="text-sm font-medium text-navy mb-1 block">Name (optional)</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl bg-sand/40 border border-sand px-4 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50"
                autoComplete="name"
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-medium text-navy mb-1 block">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-sand/40 border border-sand px-4 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-navy mb-1 block">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-sand/40 border border-sand px-4 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-gold text-navy font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-navy/60">
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-gold hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-gold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={continueAsGuest}
            className="flex-1 py-2.5 rounded-full border border-sand text-sm text-navy/70 hover:text-navy transition-colors"
          >
            Continue as Guest
          </button>
          <button
            type="button"
            onClick={closeAuthModal}
            className="flex-1 py-2.5 rounded-full text-sm text-navy/50 hover:text-navy transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
