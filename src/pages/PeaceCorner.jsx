import { useState, useEffect, useCallback } from 'react'
import SectionTitle from '../components/SectionTitle'
import { peaceVerses, surrenderPrayer, breathingGuide } from '../data/peaceCorner'
import { getDayIndex } from '../data/dailyContent'

const TOTAL_SECONDS = 5 * 60

export default function PeaceCorner() {
  const verse = peaceVerses[getDayIndex() % peaceVerses.length]
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const phase = breathingGuide[phaseIndex]

  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          return TOTAL_SECONDS
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running])

  useEffect(() => {
    if (!running) return

    const phaseTimer = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % breathingGuide.length)
    }, phase.duration * 1000)

    return () => clearInterval(phaseTimer)
  }, [running, phase.duration])

  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }, [])

  const toggleTimer = () => {
    if (!running && secondsLeft === TOTAL_SECONDS) {
      setSecondsLeft(TOTAL_SECONDS)
    }
    setRunning(!running)
  }

  const resetTimer = () => {
    setRunning(false)
    setSecondsLeft(TOTAL_SECONDS)
    setPhaseIndex(0)
  }

  return (
    <section className="min-h-[80vh] bg-gradient-to-b from-sage/15 via-cream to-rose/10">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
        <SectionTitle subtitle="A quiet place for anxious moments. Breathe. You are safe here.">
          Peace Corner
        </SectionTitle>

        <div className="my-12 flex justify-center">
          <div
            className={`w-40 h-40 rounded-full bg-sage/30 border-2 border-sage flex items-center justify-center ${
              running ? 'animate-breathe' : ''
            }`}
          >
            <div className="text-center">
              <p className="font-display text-3xl text-navy">{formatTime(secondsLeft)}</p>
              <p className="text-xs text-navy/60 mt-1">5 min timer</p>
            </div>
          </div>
        </div>

        {running && (
          <p className="text-lg text-navy font-medium mb-8">{phase.phase}</p>
        )}

        <div className="flex justify-center gap-4 mb-12">
          <button
            type="button"
            onClick={toggleTimer}
            className="px-8 py-3 rounded-full bg-gold text-navy font-medium hover:bg-gold/90 transition-colors"
          >
            {running ? 'Pause' : secondsLeft < TOTAL_SECONDS ? 'Resume' : 'Begin breathing'}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="px-6 py-3 rounded-full border border-navy/20 text-navy text-sm hover:border-gold transition-colors"
          >
            Reset
          </button>
        </div>

        <blockquote className="rounded-2xl bg-sand/40 p-6 border border-sand mb-8">
          <p className="font-display text-xl italic text-navy/90">&ldquo;{verse.text}&rdquo;</p>
          <cite className="block mt-2 text-sm text-gold not-italic">— {verse.reference}</cite>
        </blockquote>

        <div className="rounded-2xl bg-rose/25 p-6 border border-rose/40 text-left mb-8">
          <h2 className="text-xs font-medium text-navy/60 uppercase tracking-wide text-center">
            Surrender prayer
          </h2>
          <p className="mt-3 text-navy italic leading-relaxed text-center">{surrenderPrayer}</p>
        </div>

      </div>
    </section>
  )
}
