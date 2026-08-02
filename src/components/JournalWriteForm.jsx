import { FIELD_LIMITS } from '../services/journalLocalService'
import JournalSyncStatus from './JournalSyncStatus'

const fieldClass =
  'vnb-write-input w-full flex-1 min-h-0 bg-transparent border-0 border-b border-sand/70 px-0 py-1.5 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-gold/60 resize-none transition-colors'

export default function JournalWriteForm({
  form,
  onChange,
  onSubmit,
  onBack,
  saving,
  loading,
  syncStatus,
  isAuthenticated,
  isEditing = false,
  submitLabel = 'Save to my journal',
  validationError,
}) {
  const updateField = (field, value) => {
    onChange({ ...form, [field]: value })
  }

  return (
    <form onSubmit={onSubmit} className="vnb-page-fill vnb-write-form journal-fade-in">
      <div className="vnb-write-top">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-navy/50 hover:text-navy transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
        >
          ← Back
        </button>
        <p className="font-display text-base text-navy">
          {isEditing ? 'Edit entry' : "Today's entry"}
        </p>
      </div>

      {validationError && <p className="vnb-inline-error">{validationError}</p>}

      <div className="vnb-write-fields">
        <label className="vnb-write-field">
          <span className="vnb-field-label">Today&apos;s fear</span>
          <textarea
            value={form.fear}
            onChange={(e) => updateField('fear', e.target.value)}
            className={fieldClass}
            placeholder="What is weighing on your heart?"
            maxLength={FIELD_LIMITS.fear}
            aria-label="Write today's fear"
          />
        </label>

        <label className="vnb-write-field">
          <span className="vnb-field-label">One gratitude</span>
          <textarea
            value={form.gratitude}
            onChange={(e) => updateField('gratitude', e.target.value)}
            className={fieldClass}
            placeholder="One thing, however small..."
            maxLength={FIELD_LIMITS.gratitude}
            aria-label="Write one gratitude"
          />
        </label>

        <label className="vnb-write-field">
          <span className="vnb-field-label">Goal for tomorrow</span>
          <textarea
            value={form.goal}
            onChange={(e) => updateField('goal', e.target.value)}
            className={fieldClass}
            placeholder="Just one step — nothing overwhelming"
            maxLength={FIELD_LIMITS.tomorrowGoal}
            aria-label="One small goal for tomorrow"
          />
        </label>
      </div>

      <div className="vnb-write-footer">
        <button
          type="submit"
          disabled={saving || loading}
          className="vnb-action-btn vnb-action-btn--gold w-full"
        >
          {saving ? 'Saving…' : isEditing ? 'Save changes' : submitLabel}
        </button>
        <JournalSyncStatus status={syncStatus} isAuthenticated={isAuthenticated} />
      </div>
    </form>
  )
}
