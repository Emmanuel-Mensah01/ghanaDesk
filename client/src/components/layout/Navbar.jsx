// src/components/layout/Navbar.jsx
// ─────────────────────────────────────────
// Public navbar — landing, submit ticket,
// track ticket pages
// ─────────────────────────────────────────

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../ui/Button'

const NAV_LINKS = [
  { label: 'Home',          path: '/' },
  { label: 'Submit Ticket', path: '/submit-ticket' },
  { label: 'Track Ticket',  path: '/track-ticket' },
]

export default function Navbar() {
  const location          = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="public-navbar">
      <div className="container">
        <nav className="public-navbar__inner">

          {/* ── Logo ── */}
          <Link to="/" className="public-navbar__logo">
            <div className="public-navbar__logo-icon">
              <span>G</span>
            </div>
            <div>
              <span className="public-navbar__logo-name">GhanaDesk</span>
              <span className="public-navbar__logo-dot">.</span>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <ul className="public-navbar__links">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`public-navbar__link
                    ${location.pathname === link.path ? 'active' : ''}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── CTA ── */}
          <div className="public-navbar__cta">
            <Link to="/login">
              <Button variant="secondary" size="sm">Staff Login</Button>
            </Link>
            <Link to="/submit-ticket">
              <Button variant="primary" size="sm">Get Support</Button>
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="public-navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>

        </nav>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="public-navbar__mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`public-navbar__mobile-link
                  ${location.pathname === link.path ? 'active' : ''}
                `}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="public-navbar__mobile-actions">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" full>Staff Login</Button>
              </Link>
              <Link to="/submit-ticket" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" full>Get Support</Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  )
}