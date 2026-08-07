const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const icons = {
  'afraid-future': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <circle {...stroke} cx="12" cy="12" r="3" />
    </svg>
  ),
  lost: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <circle {...stroke} cx="12" cy="12" r="8" />
      <path {...stroke} d="M12 8v4l2 2" />
    </svg>
  ),
  overwhelmed: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M4 14c2-1 4-1 6 0s4 1 6 0M4 10c2-1 4-1 6 0s4 1 6 0" />
    </svg>
  ),
  'financial-stress': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M12 3v18M8 7h6a3 3 0 010 6H10a3 3 0 000 6h8" />
    </svg>
  ),
  alone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 0112 0" />
    </svg>
  ),
  'starting-over': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M4 12a8 8 0 0113.5-5.5M20 12a8 8 0 01-13.5 5.5" />
      <path {...stroke} d="M17 4h3v3M7 20H4v-3" />
    </svg>
  ),
  'need-peace': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M12 3c-2 3-4 5-4 8a4 4 0 008 0c0-3-2-5-4-8z" />
    </svg>
  ),
  exhausted: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M4 18h16M6 14l2-4 2 4 2-6 2 6 2-4" />
    </svg>
  ),
}

export default function EmotionIcon({ id, className = 'w-5 h-5 text-gold/70' }) {
  const Icon = icons[id]
  if (!Icon) return null
  return <Icon className={className} />
}
