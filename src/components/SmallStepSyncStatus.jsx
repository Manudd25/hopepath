export default function SmallStepSyncStatus({ status, isAuthenticated }) {
  let message = null

  if (status === 'saving') {
    message = 'Saving...'
  } else if (status === 'failed' || status === 'offline') {
    message = 'Your step could not be synced yet. It has been kept safely on this device.'
  } else if (status === 'synced' || (status === 'idle' && isAuthenticated)) {
    message = '☁ Synced to your account'
  } else if (status === 'local' || !isAuthenticated) {
    message = '✓ Saved on this device'
  }

  if (!message) return null

  const isWarning = status === 'failed' || status === 'offline'

  return (
    <p
      className={`text-center text-xs mt-4 ${isWarning ? 'text-rose-800' : 'text-navy/50'}`}
      aria-live="polite"
    >
      {message}
    </p>
  )
}
