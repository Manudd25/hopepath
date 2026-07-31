const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function SpiritualIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      {/* Gentle flame — prayer & faith */}
      <path
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M12 3c-3.5 5.5-6 9.5-6 13a6 6 0 1 0 12 0c0-3.5-2.5-7.5-6-13z"
      />
      <path
        {...stroke}
        d="M12 11c-1.2 1.8-2 3.5-2 5a2 2 0 1 0 4 0c0-1.5-.8-3.2-2-5z"
      />
    </svg>
  )
}

function EmotionalIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      {/* Breath / calm waves */}
      <path {...stroke} d="M4 8c2.8 1.6 5.2 1.6 8 0s5.2-1.6 8 0" />
      <path {...stroke} d="M4 12c2.2 1.2 4.2 1.2 6.5 0 2.3-1.2 4.3-1.2 6.5 0" />
      <path {...stroke} d="M4 16c1.6.8 3.2.8 5 0 1.8-.8 3.4-.8 5 0" />
    </svg>
  )
}

function PracticalIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path {...stroke} d="M10 6h9M10 12h9M10 18h6" />
      <path {...stroke} d="M5 6l1.5 1.5L8 5M5 12l1.5 1.5L8 11M5 18l1.5 1.5L8 17" />
    </svg>
  )
}

const icons = {
  spiritual: SpiritualIcon,
  emotional: EmotionalIcon,
  practical: PracticalIcon,
}

export default function CategoryIcon({ name, className = 'w-7 h-7 shrink-0 text-gold' }) {
  const Icon = icons[name]
  if (!Icon) return null
  return <Icon className={className} />
}
