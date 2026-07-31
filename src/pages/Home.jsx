import { Link } from 'react-router-dom'
import Button from '../components/Button'
import SectionTitle from '../components/SectionTitle'
import EmotionCard from '../components/EmotionCard'
import { emotionPreview } from '../data/emotions'
import { getTodaysSteps } from '../data/dailyContent'
import { useStories } from '../hooks/useStories'

const HERO_IMAGE = '/patrick-fore-74TufExdP3Y-unsplash.jpg'
const SMALL_STEP_TITLE = '/onesmallstep.png'

export default function Home() {
  const steps = getTodaysSteps()
  const { stories } = useStories()

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-rose/15 via-cream to-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <p className="text-sage text-sm font-medium tracking-wide uppercase mb-4">
                A gentle space of hope
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] text-navy font-semibold leading-tight text-balance">
                You don&apos;t need to have your whole life figured out today.
              </h1>
              <p className="mt-6 text-lg text-navy/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A peaceful place for people facing uncertainty, fear, burnout, emotional
                exhaustion, and new beginnings.
              </p>
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                <Button to="/feelings">I Need Hope</Button>
                <Button to="/daily-prayer" variant="secondary">
                  Today&apos;s Prayer
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div
                className="image-frame relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] max-h-[420px] lg:max-h-none"
              >
                <img
                  src={HERO_IMAGE}
                  alt="Soft sunlight through trees — a quiet, hopeful moment"
                  className="w-full h-full object-cover object-center"
                  fetchPriority="high"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-cream/10 pointer-events-none"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <SectionTitle subtitle="Tap how you're feeling — we'll meet you there with gentle support.">
          How are you feeling today?
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emotionPreview.map((emotion) => (
            <EmotionCard key={emotion.id} {...emotion} compact />
          ))}
        </div>
        <p className="text-center mt-8">
          <Link to="/feelings" className="text-sm text-gold hover:underline">
            View all feelings →
          </Link>
        </p>
      </section>

      <section className="bg-sand/30 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="image-frame mx-auto w-full max-w-xl md:max-w-2xl">
              <img
                src={SMALL_STEP_TITLE}
                alt="One small step for today"
                className="w-full h-auto block"
                decoding="async"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-cream p-6 border border-sand">
              <span className="text-xs font-medium text-gold uppercase tracking-wide">Spiritual</span>
              <p className="mt-3 text-navy">{steps.spiritual}</p>
            </div>
            <div className="rounded-2xl bg-cream p-6 border border-rose/40">
              <span className="text-xs font-medium text-sage uppercase tracking-wide">Emotional</span>
              <p className="mt-3 text-navy">{steps.emotional}</p>
            </div>
            <div className="rounded-2xl bg-cream p-6 border border-sage/40">
              <span className="text-xs font-medium text-navy/60 uppercase tracking-wide">Practical</span>
              <p className="mt-3 text-navy">{steps.practical}</p>
            </div>
          </div>
          <p className="text-center mt-8">
            <Button to="/small-steps" variant="outline">
              More small steps
            </Button>
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <SectionTitle>You are not alone.</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6">
          {stories.slice(0, 2).map((story) => (
            <article
              key={story.id}
              className="rounded-2xl bg-sand/50 p-6 border border-sand"
            >
              <p className="font-display text-lg text-navy">{story.name}</p>
              <p className="mt-3 text-sm text-navy/70 leading-relaxed">
                &ldquo;{story.struggle}&rdquo;
              </p>
              <p className="mt-3 text-sm text-navy">
                What helped: {story.helped}
              </p>
              <p className="mt-4 text-xs text-gold">— {story.verse}</p>
            </article>
          ))}
        </div>
        <p className="text-center mt-8">
          <Button to="/stories" variant="ghost">
            Read more stories
          </Button>
        </p>
      </section>
    </>
  )
}
