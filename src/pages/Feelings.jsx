import SectionTitle from '../components/SectionTitle'
import EmotionCard from '../components/EmotionCard'
import { emotions } from '../data/emotions'

export default function Feelings() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SectionTitle
        subtitle="Choose what resonates. There is no wrong answer — only honesty."
      >
        How are you feeling?
      </SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {emotions.map((emotion) => (
          <EmotionCard key={emotion.id} id={emotion.id} label={emotion.label} />
        ))}
      </div>
      <p className="mt-12 text-center text-sm text-navy/50 max-w-xl mx-auto leading-relaxed">
        HopePath is inspired by Christian faith and open to everyone. You don&apos;t need to share
        our beliefs to find a quiet place here.
      </p>
    </section>
  )
}
