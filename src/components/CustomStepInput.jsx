import { useState } from 'react'
import { CUSTOM_STEP_MAX_LENGTH } from '../lib/smallStepsUtils'

export default function CustomStepInput({
  initialValue = '',
  submitLabel = 'Save step',
  onSubmit,
  onCancel,
  saving = false,
  inputId = 'custom-step-text',
}) {
  const [text, setText] = useState(initialValue)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await onSubmit(text)
    if (result?.ok === false && result.message) {
      setError(result.message)
    } else {
      setError('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="custom-step-form journal-fade-in">
      <label htmlFor={inputId} className="custom-step-label">
        Your own small step
      </label>
      <input
        id={inputId}
        type="text"
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          if (error) setError('')
        }}
        maxLength={CUSTOM_STEP_MAX_LENGTH}
        placeholder="Something small and doable…"
        className="custom-step-input"
        autoComplete="off"
      />
      {error && (
        <p className="custom-step-error" role="alert">
          {error}
        </p>
      )}
      <div className="custom-step-actions">
        <button type="submit" disabled={saving} className="custom-step-save">
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="custom-step-cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
