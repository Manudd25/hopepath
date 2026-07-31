import { useState } from 'react'

const emptyStory = {
  name: '',
  struggle: '',
  helped: '',
  verse: '',
  verseText: '',
}

export default function StoryForm({ initial, onSubmit, onCancel, submitLabel = 'Share my story' }) {
  const [form, setForm] = useState(initial || emptyStory)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.struggle.trim() || !form.helped.trim()) return

    setSaving(true)
    try {
      await onSubmit(form)
      if (!initial) setForm(emptyStory)
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-xl bg-cream border border-sand px-4 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none'

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-sand/40 border border-sand p-6 md:p-8 space-y-5">
      <h3 className="font-display text-xl text-navy">
        {initial ? 'Edit your story' : 'Share your story'}
      </h3>
      <p className="text-sm text-navy/60 -mt-2">
        Use your first name or &ldquo;Anonymous&rdquo;. Your story can encourage someone else walking a similar path.
      </p>

      <label className="block">
        <span className="text-sm font-medium text-navy mb-2 block">Your name</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="Anonymous"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-navy mb-2 block">What you walked through</span>
        <textarea
          rows={3}
          required
          value={form.struggle}
          onChange={(e) => setForm({ ...form, struggle: e.target.value })}
          className={inputClass}
          placeholder="The struggle you faced…"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-navy mb-2 block">What helped you</span>
        <textarea
          rows={3}
          required
          value={form.helped}
          onChange={(e) => setForm({ ...form, helped: e.target.value })}
          className={inputClass}
          placeholder="A prayer, a verse, a small step, a friend…"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-navy mb-2 block">Bible verse reference</span>
        <input
          type="text"
          value={form.verse}
          onChange={(e) => setForm({ ...form, verse: e.target.value })}
          className={inputClass}
          placeholder="e.g. Psalm 34:18"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-navy mb-2 block">Verse text (optional)</span>
        <textarea
          rows={2}
          value={form.verseText}
          onChange={(e) => setForm({ ...form, verseText: e.target.value })}
          className={inputClass}
          placeholder="The words of the verse…"
        />
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-full bg-gold text-navy text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full border border-navy/20 text-navy text-sm hover:border-gold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
