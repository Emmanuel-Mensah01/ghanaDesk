// src/components/layout/PublicLayout.jsx
// ─────────────────────────────────────────
// Wraps all public pages with the
// Navbar at top and Footer at bottom
// ─────────────────────────────────────────

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function PublicLayout() {
  return (
    <div className="public-layout">

      {/* Top Navigation */}
      <Navbar />

      {/* Page Content — Outlet renders the matched child route */}
      <main className="public-layout__main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="container">
          <div className="public-footer__inner">

            <div className="public-footer__brand">
              <div className="public-footer__logo">
                <div className="public-footer__logo-icon">
                  <span>G</span>
                </div>
                <span className="public-footer__logo-name">GhanaDesk</span>
              </div>
              <p className="public-footer__tagline">
                Helping Ghanaian businesses deliver better support.
              </p>
            </div>

            <div className="public-footer__links">
              <p className="public-footer__links-title">Support</p>
              <a href="/submit-ticket">Submit a Ticket</a>
              <a href="/track-ticket">Track Your Ticket</a>
              <a href="/login">Staff Login</a>
            </div>

            <div className="public-footer__links">
              <p className="public-footer__links-title">Company</p>
              <a href="#">About</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>

          </div>

          <div className="public-footer__bottom">
            <p>© {new Date().getFullYear()} GhanaDesk · Built by EM Control IT Solutions</p>
          </div>
        </div>
      </footer>

    </div>
  )
}