import { Link } from 'react-router-dom'

export default function EmotionCard({ id, label, compact = false }) {
  return (
    <Link
      to={`/feelings/${id}`}
      className={`group block rounded-2xl bg-sand/60 hover:bg-rose/40 border border-sand hover:border-rose/60 transition-all duration-300 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <p
        className={`text-navy font-medium group-hover:text-navy/90 ${
          compact ? 'text-sm' : 'text-base'
        }`}
      >
        {label}
      </p>
    </Link>
  )
}
