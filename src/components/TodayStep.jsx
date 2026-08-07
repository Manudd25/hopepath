import { useState } from 'react'
import { Link } from 'react-router-dom'
import CustomStepInput from './CustomStepInput'
import SmallStepSyncStatus from './SmallStepSyncStatus'
import { isCustomStep } from '../lib/smallStepsUtils'

export default function TodayStep({
  step,
  onComplete,
  onEdit,
  onRemove,
  completing,
  savingEdit,
  removing,
  syncStatus,
  isAuthenticated,
}) {
  const [editing, setEditing] = useState(false)

  if (!step) return null

  const custom = isCustomStep(step.stepId)

  const handleEdit = async (text) => {
    const result = await onEdit(text)
    if (result?.ok !== false) {
      setEditing(false)
    }
    return result
  }

  return (
    <section
      className="small-step-today rounded-2xl bg-sand/50 border border-sand p-6 md:p-8 text-center journal-fade-in"
      aria-live="polite"
    >
      <p className="text-xs uppercase tracking-widest text-navy/45 font-medium">
        Your step for today
      </p>

      {editing ? (
        <div className="mt-4 text-left">
          <CustomStepInput
            inputId="edit-custom-step"
            initialValue={step.text}
            submitLabel="Save changes"
            onSubmit={handleEdit}
            onCancel={() => setEditing(false)}
            saving={savingEdit}
          />
        </div>
      ) : (
        <>
          <p className="font-display text-2xl text-navy mt-3">{step.text}</p>
          {custom && (
            <p className="text-[0.65rem] text-navy/40 mt-1 uppercase tracking-widest">Your step</p>
          )}
        </>
      )}

      {!step.completed && !editing ? (
        <>
          <p className="text-sm text-navy/65 mt-4 max-w-md mx-auto leading-relaxed">
            That&apos;s enough for today. One small step still counts.
          </p>
          <button
            type="button"
            onClick={onComplete}
            disabled={completing || removing}
            className="mt-6 px-6 py-2.5 rounded-full border border-sage/60 bg-sage/15 text-sm text-navy hover:bg-sage/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-50"
          >
            {completing ? 'Saving…' : 'Mark as done'}
          </button>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            {custom && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={removing}
                className="text-xs text-navy/50 hover:text-navy transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
              >
                Edit step
              </button>
            )}
            <button
              type="button"
              onClick={onRemove}
              disabled={removing || completing}
              className="text-xs text-navy/50 hover:text-rose-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded disabled:opacity-50"
            >
              {removing ? 'Removing…' : 'Remove today\u2019s step'}
            </button>
          </div>
        </>
      ) : step.completed && !editing ? (
        <div className="mt-5 space-y-2 journal-fade-in">
          <p className="text-base text-navy/80">You took a small step today. 🌿</p>
          <p className="text-sm text-navy/55 max-w-md mx-auto leading-relaxed">
            You didn&apos;t have to solve everything. You just had to begin.
          </p>
          <div className="mt-6 pt-5 border-t border-sand/60">
            <p className="text-sm text-navy/60">Want to reflect on today?</p>
            <Link
              to="/journal"
              className="inline-block mt-2 text-sm text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded"
            >
              Write a few words in your Hope Journal →
            </Link>
          </div>
        </div>
      ) : null}

      <SmallStepSyncStatus status={syncStatus} isAuthenticated={isAuthenticated} />
    </section>
  )
}
