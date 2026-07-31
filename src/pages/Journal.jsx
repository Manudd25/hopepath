import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import { useJournal } from '../hooks/useJournal'
import { useFirebase } from '../context/FirebaseContext'

const emptyEntry = { fear: '', gratitude: '', goal: '' }

export default function Journal() {
  const { entries, loading, error, saveEntry, deleteEntry } = useJournal()
  const { authError } = useFirebase()
  const [today, setToday] = useState(emptyEntry)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const entry = { ...today, date, id: Date.now() }

    setSaving(true)
    try {
      await saveEntry(entry)
      setToday(emptyEntry)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (entryId) => {
    if (!window.confirm('Delete this journal entry? This cannot be undone.')) return
    setDeletingId(entryId)
    try {
      await deleteEntry(entryId)
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'w-full rounded-xl bg-sand/40 border border-sand px-4 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none'

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SectionTitle subtitle="Only you can see your journal. Entries are tied to your private session — never shared with other visitors.">
        Hope Journal
      </SectionTitle>

      {(authError || error) && (
        <p className="mb-6 text-sm text-rose-800 bg-rose/30 rounded-xl p-4 border border-rose">
          {authError || error}
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <label className="block">
          <span className="text-sm font-medium text-navy mb-2 block">Write today&apos;s fear</span>
          <textarea
            rows={3}
            value={today.fear}
            onChange={(e) => setToday({ ...today, fear: e.target.value })}
            className={inputClass}
            placeholder="What is weighing on your heart?"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-navy mb-2 block">Write one gratitude</span>
          <textarea
            rows={2}
            value={today.gratitude}
            onChange={(e) => setToday({ ...today, gratitude: e.target.value })}
            className={inputClass}
            placeholder="One thing, however small..."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-navy mb-2 block">One small goal for tomorrow</span>
          <textarea
            rows={2}
            value={today.goal}
            onChange={(e) => setToday({ ...today, goal: e.target.value })}
            className={inputClass}
            placeholder="Just one step — nothing overwhelming"
          />
        </label>

        <button
          type="submit"
          disabled={saving || loading}
          className="w-full py-3 rounded-full bg-gold text-navy font-medium hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save to my journal'}
        </button>
      </form>

      {loading && (
        <p className="mt-12 text-center text-sm text-navy/50">Loading your journal…</p>
      )}

      {!loading && entries.length > 0 && (
        <section className="mt-16" aria-label="Past journal entries">
          <h2 className="font-display text-xl text-navy mb-6">Past entries</h2>
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl bg-sand/30 p-5 border border-sand text-sm relative"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-xs text-gold">{entry.date}</p>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="text-xs text-navy/50 hover:text-rose-800 transition-colors disabled:opacity-50 shrink-0"
                    aria-label={`Delete entry from ${entry.date}`}
                  >
                    {deletingId === entry.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
                {entry.fear && (
                  <p className="text-navy/80">
                    <span className="font-medium">Fear:</span> {entry.fear}
                  </p>
                )}
                {entry.gratitude && (
                  <p className="text-navy/80 mt-2">
                    <span className="font-medium">Gratitude:</span> {entry.gratitude}
                  </p>
                )}
                {entry.goal && (
                  <p className="text-navy/80 mt-2">
                    <span className="font-medium">Tomorrow:</span> {entry.goal}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
