import { formatFullDate } from '../lib/journalUtils'

function JournalField({ label, text }) {
  if (!text) return null
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-widest text-navy/45">{label}</h3>
      <p className="text-navy/85 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  )
}

export default function JournalEntryDetail({ entry, onBack, onEdit, onDelete, deleting }) {
  const tomorrowGoal = entry.tomorrowGoal || entry.goal

  return (
    <div className="journal-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 text-sm text-navy/50 hover:text-navy transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
      >
        ← Back to journal
      </button>

      <header className="mb-10 pb-6 border-b border-sand/50">
        <time className="font-display text-2xl text-navy block" dateTime={entry.entryDate}>
          {formatFullDate(entry.entryDate)}
        </time>
      </header>

      <div className="space-y-10">
        <JournalField label="Today's fear" text={entry.fear} />
        <JournalField label="One gratitude" text={entry.gratitude} />
        <JournalField label="One small goal for tomorrow" text={tomorrowGoal} />
      </div>

      <div className="mt-12 pt-6 border-t border-sand/40 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => onEdit(entry)}
          className="text-sm text-navy/60 hover:text-navy transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded px-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          disabled={deleting}
          className="text-sm text-navy/60 hover:text-rose-800 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded px-1"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
