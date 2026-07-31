import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/feelings', label: 'Feelings' },
  { to: '/daily-prayer', label: 'Daily Prayer' },
  { to: '/small-steps', label: 'Small Steps' },
  { to: '/stories', label: 'Stories' },
  { to: '/journal', label: 'Journal' },
  { to: '/peace-corner', label: 'Peace Corner' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand/60">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-display text-2xl font-semibold text-navy tracking-tight"
          >
            Hope Path
          </Link>

          <button
            type="button"
            className="md:hidden p-2 text-navy"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-2 lg:px-3 py-2 text-xs lg:text-sm rounded-full transition-colors ${
                      isActive
                        ? 'text-gold font-medium'
                        : 'text-navy/70 hover:text-navy'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {open && (
          <ul className="md:hidden pb-4 space-y-1 border-t border-sand/60 pt-3">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm ${
                      isActive ? 'bg-sand text-navy font-medium' : 'text-navy/70'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
