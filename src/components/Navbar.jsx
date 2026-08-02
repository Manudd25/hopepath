import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AccountMenu from './AccountMenu'

const navLinks = [
  { to: '/feelings', label: 'Feelings' },
  { to: '/daily-prayer', label: 'Daily Prayer' },
  { to: '/small-steps', label: 'Small Steps' },
  { to: '/stories', label: 'Stories' },
  { to: '/journal', label: 'Journal' },
  { to: '/peace-corner', label: 'Peace Corner' },
  { to: '/resources', label: 'Resources' },
  { to: '/hope-assistant', label: 'Hope AI' },
  { to: '/about', label: 'About' },
]

const navLinkClass = ({ isActive }) =>
  `block px-1.5 lg:px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm whitespace-nowrap rounded-full transition-colors ${
    isActive ? 'text-gold font-medium' : 'text-navy/70 hover:text-navy hover:bg-sand/30'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand/60">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6" aria-label="Main">
        {/* Mobile & tablet bar */}
        <div className="flex lg:hidden items-center justify-between h-14 gap-3">
          <Link
            to="/"
            className="font-display text-xl font-semibold text-navy tracking-tight shrink-0"
          >
            Hope Path
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            <AccountMenu compact />
            <button
              type="button"
              className="p-2 text-navy rounded-full hover:bg-sand/40 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop bar */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:h-16 lg:gap-4">
          <Link
            to="/"
            className="font-display text-2xl font-semibold text-navy tracking-tight shrink-0"
          >
            Hope Path
          </Link>

          <ul className="flex flex-1 items-center justify-center gap-0.5 min-w-0 px-2">
            {navLinks.map(({ to, label }) => (
              <li key={to} className="shrink-0">
                <NavLink to={to} className={navLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="shrink-0">
            <AccountMenu compact />
          </div>
        </div>

        {/* Mobile menu drawer */}
        {open && (
          <div className="lg:hidden border-t border-sand/60 py-3">
            <ul className="space-y-0.5">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-lg text-sm ${
                        isActive ? 'bg-sand/60 text-navy font-medium' : 'text-navy/70 hover:bg-sand/30'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
