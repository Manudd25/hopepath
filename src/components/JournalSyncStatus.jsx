export default function JournalSyncStatus({ status, isAuthenticated }) {
  let message = null

  if (status === 'saving') {
    message = 'Saving...'
  } else if (status === 'failed') {
    message = 'Your entry could not be synced. It has been kept safely on this device.'
  } else if (status === 'offline') {
    message = 'Your entry could not be synced. It has been kept safely on this device.'
  } else if (status === 'synced' || (status === 'idle' && isAuthenticated)) {
    message = '☁ Synced to your account'
  } else if (status === 'local' || !isAuthenticated) {
    message = '✓ Saved on this device'
  }

  if (!message) return null

  const isWarning = status === 'failed' || status === 'offline'

  return (
    <p
      className={`text-center text-[0.65rem] mt-1 ${
        isWarning ? 'text-rose-800' : 'text-navy/50'
      }`}
      aria-live="polite"
    >
      {message}
    </p>
  )
}
