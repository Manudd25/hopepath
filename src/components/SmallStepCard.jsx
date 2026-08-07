import { useState } from 'react'
import CategoryIcon from './CategoryIcon'
import CustomStepInput from './CustomStepInput'
import { isCustomStep } from '../lib/smallStepsUtils'

function StepSelector({ selected }) {
  return (
    <span
      className={`step-selector mt-0.5 shrink-0 ${selected ? 'step-selector--selected' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" fill="none" className="step-selector__svg">
        <circle
          cx="10"
          cy="10"
          r="8.25"
          className="step-selector__ring"
          strokeWidth="1.5"
        />
        {selected ? (
          <path
            d="M6.5 10.2 8.8 12.5 13.8 7.5"
            className="step-selector__check"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <circle cx="10" cy="10" r="2.25" className="step-selector__dot" />
        )}
      </svg>
    </span>
  )
}

function StepOption({ step, selected, disabled, onSelect, isCustom = false }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(step)}
        disabled={disabled}
        aria-pressed={selected}
        className={`step-option w-full flex items-start gap-3.5 text-left text-navy rounded-xl px-2.5 py-2.5 -mx-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
          selected
            ? 'bg-gold/12 step-option--selected'
            : disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-sand/40'
        }`}
      >
        <StepSelector selected={selected} />
        <span className={`pt-0.5 leading-snug ${selected ? 'font-medium text-navy' : 'text-navy/85'}`}>
          {step.text}
          {isCustom && (
            <span className="block text-[0.65rem] text-navy/40 mt-0.5 font-normal">Your step</span>
          )}
        </span>
      </button>
    </li>
  )
}

export default function SmallStepCard({
  category,
  steps,
  selectedStep,
  onSelect,
  onRefresh,
  onSaveCustom,
  selectionLocked,
  savingCustom,
}) {
  const [showCustomForm, setShowCustomForm] = useState(false)

  const iconClass =
    category.icon === 'emotional'
      ? 'text-sage'
      : category.icon === 'practical'
        ? 'text-navy/50'
        : 'text-gold'

  const selectedInCategory =
    selectedStep?.category === category.id ? selectedStep.stepId : null

  const visibleSteps = [...steps]
  if (
    selectedStep &&
    selectedStep.category === category.id &&
    !steps.some((s) => s.stepId === selectedStep.stepId)
  ) {
    visibleSteps.unshift({
      stepId: selectedStep.stepId,
      text: selectedStep.text,
    })
  }

  const handleSaveCustom = async (text) => {
    const result = await onSaveCustom(text)
    if (result?.ok !== false) {
      setShowCustomForm(false)
    }
    return result
  }

  return (
    <div className={`rounded-2xl ${category.color} p-8 border border-sand/60 flex flex-col`}>
      <h2 className="font-display text-2xl text-navy font-semibold flex items-center gap-3">
        <CategoryIcon name={category.icon} className={`w-8 h-8 shrink-0 ${iconClass}`} />
        {category.title}
      </h2>

      <ul className="mt-6 space-y-2 flex-1" role="list">
        {visibleSteps.map((step) => (
          <StepOption
            key={step.stepId}
            step={step}
            selected={selectedInCategory === step.stepId}
            disabled={selectionLocked}
            onSelect={onSelect}
            isCustom={isCustomStep(step.stepId)}
          />
        ))}
      </ul>

      <div className="mt-5 space-y-3">
        {!showCustomForm ? (
          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            disabled={selectionLocked}
            className="text-xs text-navy/50 hover:text-navy/75 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded disabled:opacity-40"
          >
            Write your own step
          </button>
        ) : (
          <CustomStepInput
            inputId={`custom-step-${category.id}`}
            onSubmit={handleSaveCustom}
            onCancel={() => setShowCustomForm(false)}
            saving={savingCustom}
          />
        )}

        <button
          type="button"
          onClick={() => onRefresh(category.id)}
          disabled={selectionLocked}
          className="block text-xs text-navy/45 hover:text-navy/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded disabled:opacity-40"
        >
          ↻ Different steps
        </button>
      </div>
    </div>
  )
}
