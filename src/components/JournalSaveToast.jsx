import { useEffect, useState } from 'react'

export default function JournalSaveToast({ trigger }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!trigger) return

    setShow(true)
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!show) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-sage/20 border border-sage/40 text-sm text-navy shadow-sm journal-fade-in"
    >
      Your thoughts have been safely saved. 🌿
    </div>
  )
}
