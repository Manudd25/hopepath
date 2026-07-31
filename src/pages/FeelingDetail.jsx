import { useParams, Link, Navigate } from 'react-router-dom'
import Button from '../components/Button'
import { emotions } from '../data/emotions'

export default function FeelingDetail() {
  const { emotionId } = useParams()
  const emotion = emotions.find((e) => e.id === emotionId)

  if (!emotion) return <Navigate to="/feelings" replace />

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <Link
        to="/feelings"
        className="text-sm text-navy/60 hover:text-gold transition-colors"
      >
        ← Back to feelings
      </Link>

      <header className="mt-8">
        <p className="text-sage text-sm font-medium uppercase tracking-wide">You said</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy font-semibold mt-2">
          {emotion.label}
        </h1>
      </header>

      <div className="mt-10 space-y-8">
        <section className="rounded-2xl bg-sand/50 p-6 border border-sand">
          <h2 className="text-xs font-medium text-gold uppercase tracking-wide">Verse</h2>
          <p className="font-display text-xl text-navy mt-2">{emotion.verse}</p>
          <p className="mt-3 text-navy/80 italic leading-relaxed">{emotion.verseText}</p>
        </section>

        <section>
          <h2 className="text-xs font-medium text-sage uppercase tracking-wide">Reflection</h2>
          <p className="mt-3 text-navy leading-relaxed">{emotion.reflection}</p>
        </section>

        <section className="rounded-2xl bg-rose/30 p-6 border border-rose/50">
          <h2 className="text-xs font-medium text-navy/60 uppercase tracking-wide">Prayer</h2>
          <p className="mt-3 text-navy italic leading-relaxed">&ldquo;{emotion.prayer}&rdquo;</p>
        </section>

        <section className="rounded-2xl bg-sage/20 p-6 border border-sage/40">
          <h2 className="text-xs font-medium text-navy/60 uppercase tracking-wide">One small step</h2>
          <p className="mt-3 text-navy font-medium">{emotion.smallStep}</p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Button to="/peace-corner" variant="secondary">
          Visit Peace Corner
        </Button>
        <Button to="/daily-prayer" variant="outline">
          Today&apos;s Prayer
        </Button>
      </div>
    </article>
  )
}
