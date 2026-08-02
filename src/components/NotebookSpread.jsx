import { useState, useCallback } from 'react'

const FLIP_MS = 720

export default function NotebookSpread({
  leftContent,
  rightContent,
  prevRightContent,
  flip,
  frozenRight,
}) {
  return (
    <div className="vnb-spread vnb-spread--open">
      <div className="vnb-spine" aria-hidden="true" />
      <div className="vnb-page vnb-page--left">{leftContent}</div>
      <div className="vnb-page vnb-page--right vnb-flip-scene">
        <div className="vnb-page-layer vnb-page-layer--base">{rightContent}</div>
        {flip && frozenRight && (
          <div
            className={`vnb-page-layer vnb-page-layer--flip vnb-page-layer--flip-${flip}`}
            aria-hidden="true"
          >
            {frozenRight}
          </div>
        )}
      </div>
    </div>
  )
}

export function useNotebookFlip({ canPrev, canNext, onPrev, onNext, rightContent, prevRightContent }) {
  const [flip, setFlip] = useState(null)
  const [frozenRight, setFrozenRight] = useState(null)

  const clearFlip = useCallback(() => {
    setFlip(null)
    setFrozenRight(null)
  }, [])

  const handlePrev = useCallback(() => {
    if (!canPrev || flip) return
    setFrozenRight(prevRightContent)
    setFlip('backward')
    onPrev()
    setTimeout(clearFlip, FLIP_MS)
  }, [canPrev, flip, prevRightContent, onPrev, clearFlip])

  const handleNext = useCallback(() => {
    if (!canNext || flip) return
    setFrozenRight(rightContent)
    setFlip('forward')
    onNext()
    setTimeout(clearFlip, FLIP_MS)
  }, [canNext, flip, rightContent, onNext, clearFlip])

  return {
    flip,
    frozenRight,
    handlePrev,
    handleNext,
    isFlipping: Boolean(flip),
  }
}

export { FLIP_MS }
