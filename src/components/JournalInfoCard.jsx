import { useState } from 'react'
import { dismissInfoCard, isInfoCardDismissed } from '../services/journalLocalService'
import { useAuth } from '../context/AuthContext'

export default function JournalInfoCard() {
  const { isAuthenticated, openAuthModal, continueAsGuest } = useAuth()
  const [visible, setVisible] = useState(() => !isInfoCardDismissed())

  if (isAuthenticated || !visible) return null

  const handleDismiss = () => {
    dismissInfoCard()
    setVisible(false)
  }

  const handleContinueGuest = () => {
    continueAsGuest()
    handleDismiss()
  }

  return (
    <div className="mt-6 rounded-2xl bg-sage/8 border border-sage/25 p-4">
      <p className="text-sm text-navy/80 leading-relaxed">
        Your journal is currently stored only on this device.
      </p>
      <p className="mt-2 text-sm text-navy/80 leading-relaxed">
        If you clear your browser data or switch devices, your entries may be lost.
      </p>
      <p className="mt-2 text-sm text-navy/80 leading-relaxed">
        Sign in to securely sync your journal across your devices.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleContinueGuest}
          className="px-5 py-2 rounded-full border border-sand text-sm text-navy/70 hover:text-navy transition-colors"
        >
          Continue as Guest
        </button>
        <button
          type="button"
          onClick={openAuthModal}
          className="px-5 py-2 rounded-full bg-gold text-navy text-sm font-medium hover:bg-gold/90 transition-colors"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-2 text-xs text-navy/40 hover:text-navy/60 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
