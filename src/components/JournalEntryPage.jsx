import { formatFullDate } from '../lib/journalUtils'

function FieldBox({ label, text, placeholder = '—' }) {
  return (
    <div className="vnb-field-box">
      <span className="vnb-field-label">{label}</span>
      <p className="vnb-field-text">{text?.trim() ? text : placeholder}</p>
    </div>
  )
}

export function EntryFieldsGrid({ entry }) {
  const tomorrowGoal = entry.tomorrowGoal || entry.goal
  return (
    <div className="vnb-fields-grid">
      <FieldBox label="Today's fear" text={entry.fear} />
      <FieldBox label="One gratitude" text={entry.gratitude} />
      <FieldBox label="Goal for tomorrow" text={tomorrowGoal} />
    </div>
  )
}

export function EntryActions({ onEdit, onDelete, deleting, editLabel = 'Edit' }) {
  if (!onEdit) return null
  return (
    <div className="vnb-actions">
      <button type="button" onClick={onEdit} className="vnb-action-btn vnb-action-btn--primary">
        {editLabel}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="vnb-action-btn vnb-action-btn--muted"
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}

export default function JournalEntryPage({ entry, compact = false, onEdit, onDelete, deleting }) {
  return (
    <article className={`vnb-page-fill${compact ? ' vnb-entry-compact' : ''}`}>
      <header className="vnb-entry-header">
        <time className="font-display text-base text-navy block" dateTime={entry.entryDate}>
          {formatFullDate(entry.entryDate)}
        </time>
        {entry.pendingSync && <p className="text-[0.65rem] text-navy/40 mt-0.5">Pending sync</p>}
      </header>
      <EntryFieldsGrid entry={entry} />
      {!compact && (
        <EntryActions
          onEdit={onEdit ? () => onEdit(entry) : null}
          onDelete={() => onDelete(entry.id)}
          deleting={deleting}
        />
      )}
    </article>
  )
}

export function JournalTodayPage({
  todayEntry,
  onBegin,
  onEdit,
  onDelete,
  deleting,
  pastEntryCount,
  error,
  validationError,
}) {
  return (
    <div className="vnb-page-fill vnb-today">
      <header className="vnb-today-header">
        <h1 className="font-display text-xl text-navy">Today</h1>
        <p className="text-xs text-navy/50 mt-0.5 italic">How is your heart?</p>
      </header>

      {todayEntry ? (
        <>
          <EntryFieldsGrid entry={todayEntry} />
          <EntryActions
            onEdit={onEdit ? () => onEdit(todayEntry) : null}
            onDelete={() => onDelete(todayEntry.id)}
            deleting={deleting}
            editLabel="Edit entry"
          />
        </>
      ) : (
        <div className="vnb-today-empty">
          <p className="text-sm text-navy/60 text-center leading-relaxed">
            Take a quiet moment to reflect on your day.
          </p>
          <button type="button" onClick={onBegin} className="vnb-action-btn vnb-action-btn--gold">
            Begin today&apos;s entry
          </button>
        </div>
      )}

      {pastEntryCount > 0 && (
        <p className="vnb-today-hint">
          Turn the page to read {pastEntryCount} earlier {pastEntryCount === 1 ? 'entry' : 'entries'}.
        </p>
      )}

      {(error || validationError) && (
        <p className="vnb-inline-error">{validationError || error}</p>
      )}
    </div>
  )
}

export function JournalWelcomeLeft() {
  return (
    <div className="vnb-page-fill vnb-welcome-left">
      <p className="font-display text-lg text-navy/80 italic leading-snug">
        &ldquo;Be still, and know.&rdquo;
      </p>
      <p className="mt-3 text-xs text-navy/45 leading-relaxed">
        Each page holds one day&apos;s reflection — fear, gratitude, and one small step forward.
      </p>
    </div>
  )
}
