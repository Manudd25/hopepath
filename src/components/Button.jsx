import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-gold text-navy hover:bg-gold/90 shadow-sm',
  secondary:
    'bg-sand text-navy hover:bg-sand/80 border border-sand',
  outline:
    'bg-transparent text-navy border border-navy/20 hover:border-gold hover:text-gold',
  ghost: 'bg-transparent text-navy hover:bg-sand/50',
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream'

  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
