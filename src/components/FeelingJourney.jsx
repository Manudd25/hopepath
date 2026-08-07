import { useState, useEffect, useId, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import { useSmallSteps } from '../hooks/useSmallSteps'
import { getFeelingStepId } from '../data/emotions'
import { trackFeelingsInteraction } from '../lib/analytics'

function RevealPanel({ id, open, children, className = '' }) {
  return (
    <div
      id={id}
      className={`feeling-reveal ${open ? 'feeling-reveal--open' : 'feeling-reveal--closed'} ${className}`}
      aria-hidden={!open}
    >
      <div className="feeling-reveal__inner">{children}</div>
    </div>
  )
}

function ProgressButton({ children, onClick, ariaExpanded, ariaControls, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={`feeling-progress-btn ${className}`}
    >
      {children}
    </button>
  )
}

export default function FeelingJourney({ emotion }) {
  const feelingStepId = getFeelingStepId(emotion.id)
  const stepPanelId = useId()
  const versePanelId = useId()
  const prayerPanelId = useId()

  const { todayStep, selectStep, loading: stepsLoading } = useSmallSteps()

  const [showAll, setShowAll] = useState(false)
  const [stepOpen, setStepOpen] = useState(false)
  const [verseOpen, setVerseOpen] = useState(false)
  const [prayerOpen, setPrayerOpen] = useState(false)
  const [prayerExpanded, setPrayerExpanded] = useState(false)
  const [prayed, setPrayed] = useState(false)
  const [stepChosen, setStepChosen] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [stepStatus, setStepStatus] = useState('')

  const isThisStepSelected = todayStep?.stepId === feelingStepId

  useEffect(() => {
    if (isThisStepSelected) {
      setStepChosen(true)
      setStepOpen(true)
    }
  }, [isThisStepSelected])

  const effectiveStepOpen = showAll || stepOpen
  const effectiveVerseOpen = showAll || verseOpen
  const effectivePrayerOpen = showAll || prayerOpen

  const handleShowAll = () => {
    setShowAll(true)
    setStepOpen(true)
    setVerseOpen(true)
    setPrayerOpen(true)
    setPrayerExpanded(true)
    trackFeelingsInteraction('show_all')
  }

  const handleRevealStep = () => {
    setStepOpen(true)
    trackFeelingsInteraction('reveal_step')
  }

  const handleRevealVerse = () => {
    setVerseOpen(true)
    trackFeelingsInteraction('reveal_verse')
  }

  const handleRevealPrayer = () => {
    setPrayerOpen(true)
    trackFeelingsInteraction('reveal_prayer')
  }

  const confirmStepSelection = () => {
    setStepChosen(true)
    setStepStatus("That's enough for today. One small step still counts. 🌿")
  }

  const applyFeelingStep = async () => {
    const result = await selectStep({
      stepId: feelingStepId,
      text: emotion.smallStep,
      category: emotion.stepCategory,
    })
    if (result?.ok) {
      confirmStepSelection()
      trackFeelingsInteraction('choose_step')
    }
  }

  const handleChooseStep = () => {
    if (todayStep?.completed) return

    if (todayStep && todayStep.stepId !== feelingStepId) {
      setShowReplace(true)
      return
    }

    applyFeelingStep()
  }

  const handleReplaceConfirm = () => {
    setShowReplace(false)
    applyFeelingStep()
  }

  const closeReplaceDialog = useCallback(() => setShowReplace(false), [])

  useEffect(() => {
    if (!showReplace) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeReplaceDialog()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showReplace, closeReplaceDialog])

  const handlePrayWithWords = () => {
    setPrayerExpanded(true)
    trackFeelingsInteraction('pray_open')
  }

  const handlePrayed = () => {
    setPrayed(true)
    trackFeelingsInteraction('prayed')
  }

  return (
    <div className="feeling-journey mt-10">
      <div className="flex justify-end mb-6">
        {!showAll && (
          <button
            type="button"
            onClick={handleShowAll}
            className="text-sm text-navy/50 hover:text-gold transition-colors underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded"
          >
            Show everything
          </button>
        )}
      </div>

      {/* Reflection — open, generous whitespace */}
      <section aria-labelledby="feeling-reflection-heading" className="feeling-section feeling-fade-in">
        <h2
          id="feeling-reflection-heading"
          className="text-xs font-medium text-sage uppercase tracking-wide"
        >
          Reflection
        </h2>
        <p className="mt-4 text-navy leading-relaxed text-lg">{emotion.reflection}</p>
      </section>

      {!effectiveStepOpen && (
        <div className="mt-10 feeling-fade-in">
          <ProgressButton
            onClick={handleRevealStep}
            ariaExpanded={false}
            ariaControls={stepPanelId}
          >
            What can I do right now?
          </ProgressButton>
        </div>
      )}

      {/* One Small Step — sage card */}
      <RevealPanel id={stepPanelId} open={effectiveStepOpen} className="mt-10">
        <section
          aria-labelledby="feeling-step-heading"
          className="rounded-2xl bg-sage/20 p-6 border border-sage/40 feeling-section"
        >
          <h2
            id="feeling-step-heading"
            className="text-xs font-medium text-navy/60 uppercase tracking-wide"
          >
            One small step
          </h2>
          <p className="mt-3 text-navy font-medium leading-relaxed">{emotion.smallStep}</p>

          {!stepChosen && !stepsLoading && (
            <button
              type="button"
              onClick={handleChooseStep}
              disabled={todayStep?.completed}
              className="feeling-action-btn mt-5"
              aria-pressed={false}
            >
              Choose this step
            </button>
          )}

          {(stepChosen || isThisStepSelected) && (
            <div className="mt-5" role="status" aria-live="polite">
              <p className="text-navy/80 text-sm leading-relaxed">
                {stepStatus || "That's enough for today. One small step still counts. 🌿"}
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-sage font-medium"
                aria-label="Step selected"
              >
                <span className="feeling-step-check" aria-hidden="true" />
                Selected for today
              </span>
            </div>
          )}
        </section>
      </RevealPanel>

      {effectiveStepOpen && !effectiveVerseOpen && (
        <div className="mt-10 feeling-fade-in">
          <ProgressButton
            onClick={handleRevealVerse}
            ariaExpanded={false}
            ariaControls={versePanelId}
          >
            Show me a word of hope
          </ProgressButton>
        </div>
      )}

      {/* Scripture — warm beige card */}
      <RevealPanel id={versePanelId} open={effectiveVerseOpen} className="mt-10">
        <section
          aria-labelledby="feeling-verse-heading"
          className="rounded-2xl bg-sand/50 p-6 border border-sand feeling-section"
        >
          <h2
            id="feeling-verse-heading"
            className="text-xs font-medium text-gold uppercase tracking-wide"
          >
            A word of hope
          </h2>
          <p className="font-display text-xl text-navy mt-2">{emotion.verse}</p>
          <blockquote className="mt-3 text-navy/80 italic leading-relaxed border-none m-0">
            {emotion.verseText}
          </blockquote>
        </section>
      </RevealPanel>

      {effectiveVerseOpen && !effectivePrayerOpen && (
        <div className="mt-10 feeling-fade-in">
          <ProgressButton
            onClick={handleRevealPrayer}
            ariaExpanded={false}
            ariaControls={prayerPanelId}
          >
            I&apos;d like a prayer
          </ProgressButton>
        </div>
      )}

      {/* Optional Prayer — dusty pink card */}
      <RevealPanel id={prayerPanelId} open={effectivePrayerOpen} className="mt-10">
        <section
          aria-labelledby="feeling-prayer-heading"
          className="rounded-2xl bg-rose/30 p-6 border border-rose/50 feeling-section"
        >
          <h2
            id="feeling-prayer-heading"
            className="text-xs font-medium text-navy/60 uppercase tracking-wide"
          >
            A prayer, if you&apos;d like one
          </h2>

          {!prayerExpanded && !prayed && (
            <button
              type="button"
              onClick={handlePrayWithWords}
              className="feeling-action-btn feeling-action-btn--subtle mt-4"
            >
              Pray with these words
            </button>
          )}

          {prayerExpanded && !prayed && (
            <div className="mt-4 feeling-fade-in">
              <p className="text-navy/70 text-sm leading-relaxed">
                Take a quiet moment. You don&apos;t need perfect words.
              </p>
              <p className="mt-5 text-navy italic leading-loose">&ldquo;{emotion.prayer}&rdquo;</p>
              <button
                type="button"
                onClick={handlePrayed}
                className="feeling-action-btn feeling-action-btn--subtle mt-6"
              >
                I&apos;ve prayed
              </button>
            </div>
          )}

          {prayed && (
            <p className="mt-4 text-navy/80 text-sm leading-relaxed" role="status" aria-live="polite">
              May you carry a little more peace with you today. 🌿
            </p>
          )}
        </section>
      </RevealPanel>

      {/* Next actions */}
      <nav
        aria-label="What would you like to do next?"
        className="mt-16 pt-10 border-t border-sand/80 space-y-10"
      >
        <div>
          <p className="text-navy/70 text-sm">Doesn&apos;t quite describe how you&apos;re feeling?</p>
          <Button to="/feelings" variant="outline" className="mt-3">
            Choose another feeling
          </Button>
        </div>

        <div>
          <p className="text-navy/70 text-sm">Or take a quiet moment instead.</p>
          <Button to="/peace-corner" variant="secondary" className="mt-3">
            Visit Peace Corner
          </Button>
        </div>

        <div>
          <p className="text-navy/70 text-sm">Want to put what you&apos;re feeling into words?</p>
          <Link
            to="/journal"
            state={{ fromFeelings: true }}
            className="feeling-action-btn inline-flex mt-3"
          >
            Write in my Hope Journal
          </Link>
        </div>
      </nav>

      {/* Replace dialog */}
      {showReplace && (
        <div
          className="feeling-dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feeling-replace-title"
        >
          <div className="feeling-dialog">
            <p id="feeling-replace-title" className="text-navy leading-relaxed">
              You already chose a small step for today. Would you like to replace it with this one?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={closeReplaceDialog}
                className="feeling-action-btn feeling-action-btn--subtle flex-1"
              >
                Keep my current step
              </button>
              <button
                type="button"
                onClick={handleReplaceConfirm}
                className="feeling-action-btn flex-1"
              >
                Choose this instead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
