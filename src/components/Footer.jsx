import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { footerVerses } from '../data/footerVerses'
import { getDayIndex } from '../data/dailyContent'

export default function Footer() {
  const verse = useMemo(
    () => footerVerses[getDayIndex() % footerVerses.length],
    []
  )

  return (
    <footer className="bg-sand/40 border-t border-sand mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <section>
            <p className="font-display text-xl text-navy font-semibold mb-2">
              Hope Path
            </p>
            <p className="text-sm text-navy/70 leading-relaxed">
              A gentle space of hope for people facing uncertainty, fear, burnout,
              and new beginnings. Helping you feel less alone — one small step at a time.
            </p>
          </section>

          <section>
            <p className="text-sm font-medium text-navy mb-3">Explore</p>
            <ul className="space-y-2 text-sm text-navy/70">
              <li><Link to="/feelings" className="hover:text-gold transition-colors">How Are You Feeling?</Link></li>
              <li><Link to="/daily-prayer" className="hover:text-gold transition-colors">Daily Prayer</Link></li>
              <li><Link to="/peace-corner" className="hover:text-gold transition-colors">Peace Corner</Link></li>
              <li><Link to="/resources" className="hover:text-gold transition-colors">Resources</Link></li>
            </ul>
          </section>

          <section>
            <p className="text-sm font-medium text-navy mb-3">Contact</p>
            <p className="text-sm text-navy/70 leading-relaxed">
              Questions or technical issues? We&apos;re here to help.
            </p>
            <Link
              to="/about#contact"
              className="inline-block mt-3 text-sm text-gold hover:underline"
            >
              Send a message
            </Link>
          </section>
        </div>

        <blockquote className="text-center border-t border-sand pt-8">
          <p className="font-display text-lg italic text-navy/80 max-w-2xl mx-auto">
            &ldquo;{verse.text}&rdquo;
          </p>
          <cite className="block mt-2 text-sm text-gold not-italic">
            — {verse.reference}
          </cite>
        </blockquote>

        <p className="text-center text-xs text-navy/50 mt-8">
          © {new Date().getFullYear()} Hope Path. Made with gentle hope.
        </p>
      </div>
    </footer>
  )
}
