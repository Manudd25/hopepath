import { useState, useEffect } from 'react'
import SectionTitle from '../components/SectionTitle'
import { fetchTodaysPrayer } from '../services/dailyPrayerService'

export default function DailyPrayer() {
  const [prayer, setPrayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    fetchTodaysPrayer()
      .then((data) => {
        if (active) setPrayer(data)
      })
      .catch(() => {
        if (active) setError('Could not load today\'s prayer. Please refresh the page.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleSave = () => {
    if (!prayer) return
    const text = `${prayer.verse}\n\n${prayer.verseText}\n\n${prayer.reflection}\n\n${prayer.prayer}`
    navigator.clipboard?.writeText(text).then(() => setSaved(true))
  }

  return (
    <section className="relative min-h-[70vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-sage/10 via-cream to-rose/10 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <SectionTitle subtitle="A fresh prayer for today — new every morning.">
          Daily Prayer
        </SectionTitle>

        <div className="flex justify-center mb-10">
          <img
            src="/candle.png"
            alt="A candle burning gently — a moment for prayer"
            className="w-full max-w-sm md:max-w-md h-auto"
            decoding="async"
          />
        </div>

        {loading && (
          <p className="text-center text-sm text-navy/50 italic">Preparing today&apos;s prayer…</p>
        )}

        {error && (
          <p className="mb-6 text-sm text-rose-800 bg-rose/30 rounded-xl p-4 border border-rose text-center">
            {error}
          </p>
        )}

        {!loading && prayer && (
          <div className="rounded-3xl bg-sand/40 border border-sand p-8 md:p-10 space-y-8">
            <div>
              <h2 className="text-xs font-medium text-gold uppercase tracking-wide">Verse of the day</h2>
              <p className="font-display text-2xl text-navy mt-2">{prayer.verse}</p>
              <p className="mt-4 text-navy/80 italic leading-relaxed">{prayer.verseText}</p>
            </div>

            <div className="border-t border-sand pt-8">
              <h2 className="text-xs font-medium text-sage uppercase tracking-wide">Reflection</h2>
              <p className="mt-3 text-navy leading-relaxed">{prayer.reflection}</p>
            </div>

            <div className="rounded-2xl bg-rose/25 p-6 border border-rose/40">
              <h2 className="text-xs font-medium text-navy/60 uppercase tracking-wide">Prayer of the day</h2>
              <p className="mt-3 text-navy italic leading-relaxed">{prayer.prayer}</p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gold text-navy text-sm font-medium hover:bg-gold/90 transition-colors"
              >
                {saved ? 'Saved to clipboard ✓' : 'Save this prayer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
