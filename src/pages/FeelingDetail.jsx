import { useParams, Link, Navigate } from 'react-router-dom'
import FeelingJourney from '../components/FeelingJourney'
import { emotions } from '../data/emotions'

export default function FeelingDetail() {
  const { emotionId } = useParams()
  const emotion = emotions.find((e) => e.id === emotionId)

  if (!emotion) return <Navigate to="/feelings" replace />

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <Link
        to="/feelings"
        className="text-sm text-navy/60 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded"
      >
        ← Back to feelings
      </Link>

      <header className="mt-8">
        <p className="text-sage text-sm font-medium uppercase tracking-wide">You said</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy font-semibold mt-2">
          {emotion.label}
        </h1>
      </header>

      <FeelingJourney emotion={emotion} />
    </article>
  )
}
