import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function UserIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  )
}

export default function AccountMenu({ compact = false }) {
  const {
    isAuthenticated,
    displayName,
    openAuthModal,
    signOut,
    showLogoutPrompt,
    dismissLogoutPrompt,
    continueAsGuest,
  } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (showLogoutPrompt) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-cream border border-sand shadow-lg p-8 text-center">
          <p className="text-navy leading-relaxed">
            You are now signed out. Would you like to continue using HopePath as a guest?
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                continueAsGuest()
                dismissLogoutPrompt()
              }}
              className="w-full py-3 rounded-full bg-gold text-navy font-medium hover:bg-gold/90 transition-colors"
            >
              Continue as Guest
            </button>
            <button
              type="button"
              onClick={dismissLogoutPrompt}
              className="w-full py-2.5 text-sm text-navy/50 hover:text-navy transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (compact) {
      return (
        <button
          type="button"
          onClick={openAuthModal}
          className="p-2 text-navy/70 rounded-full hover:bg-sand/40 hover:text-navy transition-colors"
          aria-label="Sign in"
        >
          <UserIcon />
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={openAuthModal}
        className="px-3.5 py-1.5 text-sm rounded-full border border-sand text-navy/70 hover:text-navy hover:border-gold/50 transition-colors whitespace-nowrap"
      >
        Sign In
      </button>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center rounded-full hover:bg-sand/40 transition-colors ${
          compact ? 'p-2' : 'gap-2 px-2 py-1.5'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        <span className="w-7 h-7 rounded-full bg-sage/30 border border-sage/50 flex items-center justify-center text-navy/70 shrink-0">
          <UserIcon />
        </span>
        {!compact && (
          <span className="hidden xl:inline text-sm text-navy/70 max-w-[140px] truncate">
            {displayName}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-cream border border-sand shadow-lg py-2 z-50">
          <p className="px-4 py-2 text-xs text-navy/50 truncate border-b border-sand/60 mb-1">
            {displayName}
          </p>
          <Link
            to="/journal"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-navy/80 hover:bg-sand/40 transition-colors"
          >
            My Journal
          </Link>
          <p className="px-4 py-2 text-xs text-sage">☁ Synced to your account</p>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
            className="w-full text-left px-4 py-2 text-sm text-navy/70 hover:bg-sand/40 transition-colors border-t border-sand/60 mt-1"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}
