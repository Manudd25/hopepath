import Button from '../components/Button'
import ContactForm from '../components/ContactForm'
import SectionTitle from '../components/SectionTitle'

export default function About() {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SectionTitle>About Hope Path</SectionTitle>

      <div className="prose prose-navy space-y-6 text-navy/80 leading-relaxed">
        <p>
          Hope Path was created during a season of uncertainty, emotional exhaustion, fear,
          and rebuilding. This platform was born from the desire to create a peaceful place
          where people can breathe, feel understood, and take one small step forward at a time.
        </p>
        <p>
          We combine Christian encouragement, emotional support, and practical small steps —
          without preaching aggressively. The goal is simple: helping people feel less alone.
        </p>
        <p>
          Whether you are afraid of the future, financially stressed, emotionally exhausted,
          or starting over — you belong here. You don&apos;t need to have your whole life figured
          out today.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-sand/50 p-5 border border-sand text-center">
          <p className="font-display text-lg text-navy">Peaceful</p>
          <p className="text-sm text-navy/60 mt-1">Warm, minimal design</p>
        </div>
        <div className="rounded-xl bg-sand/50 p-5 border border-sand text-center">
          <p className="font-display text-lg text-navy">Gentle</p>
          <p className="text-sm text-navy/60 mt-1">No judgment, no pressure</p>
        </div>
        <div className="rounded-xl bg-sand/50 p-5 border border-sand text-center">
          <p className="font-display text-lg text-navy">Practical</p>
          <p className="text-sm text-navy/60 mt-1">One small step at a time</p>
        </div>
        <div className="rounded-xl bg-sand/50 p-5 border border-sand text-center">
          <p className="font-display text-lg text-navy">Faith-filled</p>
          <p className="text-sm text-navy/60 mt-1">Soft Christian inspiration</p>
        </div>
      </div>

      <div id="contact" className="mt-12 rounded-2xl bg-sand/40 border border-sand p-6 md:p-8">
        <p className="font-display text-lg text-navy text-center">Get in touch</p>
        <p className="text-sm text-navy/70 mt-2 text-center">
          For questions, feedback, or technical help:
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button to="/feelings">I need hope today</Button>
      </div>
    </section>
  )
}
