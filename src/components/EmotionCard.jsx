import { Link } from 'react-router-dom'
import EmotionIcon from './EmotionIcon'

export default function EmotionCard({ id, label, compact = false }) {
  return (
    <Link
      to={`/feelings/${id}`}
      className={`emotion-card group block rounded-2xl bg-sand/60 border border-sand transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="flex items-start gap-3">
        {!compact && (
          <EmotionIcon
            id={id}
            className="w-5 h-5 text-gold/60 group-hover:text-gold/80 transition-colors shrink-0 mt-0.5"
          />
        )}
        <p
          className={`text-navy font-medium group-hover:text-navy/90 ${
            compact ? 'text-sm' : 'text-base'
          }`}
        >
          {label}
        </p>
      </div>
    </Link>
  )
}
