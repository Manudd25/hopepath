import { useState, useCallback } from 'react'
import NotebookSpread, { useNotebookFlip } from './NotebookSpread'

const COVER_MS = 1150

function NotebookPager({ spreadIndex, totalSpreads, canPrev, canNext, onPrev, onNext, disabled }) {
  return (
    <nav className="vnb-pager" aria-label="Journal pages">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled || !canPrev}
        className="vnb-pager-btn"
        aria-label="Previous page"
      >
        ← Turn page
      </button>
      <span className="vnb-pager-count">
        {spreadIndex + 1} / {totalSpreads}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || !canNext}
        className="vnb-pager-btn"
        aria-label="Next page"
      >
        Turn page →
      </button>
    </nav>
  )
}

function NotebookFooter({
  spreadIndex,
  totalSpreads,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onClose,
  showClose,
  disabled,
  hidden,
  isClosing,
}) {
  return (
    <div className={`vnb-footer${hidden ? ' vnb-footer--closed' : ''}`}>
      <NotebookPager
        spreadIndex={spreadIndex}
        totalSpreads={totalSpreads}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={onPrev}
        onNext={onNext}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onClose}
        disabled={isClosing}
        className={`vnb-close-btn${showClose ? '' : ' vnb-close-btn--hidden'}`}
        aria-hidden={!showClose}
        tabIndex={showClose ? 0 : -1}
      >
        Close journal
      </button>
    </div>
  )
}

export default function VirtualNotebook({
  isOpen,
  onOpen,
  onClose,
  loading,
  spreadIndex,
  totalSpreads,
  onPrev,
  onNext,
  canPrev,
  canNext,
  leftContent,
  rightContent,
  prevRightContent,
}) {
  const [coverHovered, setCoverHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const coverFlippedOpen = isOpen && !isClosing

  const { flip, frozenRight, handlePrev, handleNext, isFlipping } = useNotebookFlip({
    canPrev: coverFlippedOpen && canPrev,
    canNext: coverFlippedOpen && canNext,
    onPrev,
    onNext,
    rightContent,
    prevRightContent,
  })

  const handleClose = useCallback(() => {
    if (!isOpen || isClosing || !onClose) return
    setIsClosing(true)
    window.setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, COVER_MS)
  }, [isOpen, isClosing, onClose])

  const footerProps = {
    spreadIndex,
    totalSpreads,
    canPrev,
    canNext,
    onPrev: handlePrev,
    onNext: handleNext,
    onClose: handleClose,
    showClose: coverFlippedOpen,
    disabled: !coverFlippedOpen || isFlipping || isClosing,
    isClosing,
  }

  if (loading) {
    return (
      <div className="vnb">
        <div className="vnb-loading">
          <p className="text-sm text-navy/50">Preparing your journal…</p>
        </div>
        <NotebookFooter {...footerProps} hidden showClose={false} />
      </div>
    )
  }

  return (
    <div className="vnb">
      <div className="vnb-scene">
        <div className="vnb-body">
          {!isOpen ? (
            <div className="vnb-spread vnb-spread--closed-placeholder" aria-hidden="true">
              <div className="vnb-page vnb-page--left vnb-page--ghost" />
              <div className="vnb-page vnb-page--right vnb-page--ghost" />
            </div>
          ) : (
            <NotebookSpread
              leftContent={leftContent}
              rightContent={rightContent}
              prevRightContent={prevRightContent}
              flip={flip}
              frozenRight={frozenRight}
            />
          )}

          <button
            type="button"
            className={`vnb-cover${coverFlippedOpen ? ' vnb-cover--opening' : ''}${coverHovered && !isOpen && !isClosing ? ' vnb-cover--hover' : ''}${isClosing ? ' vnb-cover--closing' : ''}`}
            onClick={!isOpen && !isClosing ? onOpen : undefined}
            onMouseEnter={() => setCoverHovered(true)}
            onMouseLeave={() => setCoverHovered(false)}
            aria-label={coverFlippedOpen ? undefined : 'Open Hope Journal'}
            aria-hidden={coverFlippedOpen}
            tabIndex={coverFlippedOpen ? -1 : 0}
          >
            <div className="vnb-cover-face vnb-cover-face--front">
              <div className="vnb-cover-strap" aria-hidden="true" />
              <p className="vnb-cover-label">Hope Journal</p>
              {!isOpen && !isClosing && <p className="vnb-cover-hint">Open my journal</p>}
            </div>
            <div className="vnb-cover-face vnb-cover-face--inside" aria-hidden="true" />
          </button>
        </div>
      </div>

      <NotebookFooter {...footerProps} hidden={!isOpen && !isClosing} />
    </div>
  )
}

export function NotebookLeftPage({ dateLabel, greetingLine }) {
  return (
    <div className="vnb-page-fill vnb-left-inner">
      <p className="vnb-left-date">{dateLabel}</p>
      <p className="vnb-left-greeting">{greetingLine}</p>
      <div className="vnb-left-divider" aria-hidden="true" />
      <p className="vnb-left-note">A private space for reflection.</p>
      <svg
        className="vnb-left-leaf"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M12 21c-4-4-8-7-8-11a8 8 0 0116 0c0 4-4 7-8 11z"
        />
      </svg>
    </div>
  )
}
