// src/components/layout/DashboardLayout.jsx
// ─────────────────────────────────────────
// Wraps all dashboard pages —
// Sidebar (left) + Topnav + Page content
// ─────────────────────────────────────────

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuth from '../../hooks/useAuth'

// ── Map path to page title ──
const PAGE_TITLES = {
  '/staff':          'Dashboard',
  '/staff/tickets':  'My Tickets',
  '/admin':          'Dashboard',
  '/admin/tickets':  'All Tickets',
  '/admin/agents':   'Agents',
  '/admin/settings': 'Settings',
}

export default function DashboardLayout() {
  const location                      = useLocation()
  const { user }                      = useAuth()
  const [mobileOpen, setMobileOpen]   = useState(false)

  const pageTitle = PAGE_TITLES[location.pathname] || 'GhanaDesk'

  return (
    <div className="app-shell">

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <div className="main-content">

        {/* Top Navigation Bar */}
        <header className="topnav">

          <div className="topnav__left">
            {/* Mobile menu toggle */}
            <button
              className="topnav__icon-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none' }} // shown via CSS on mobile
            >
              ☰
            </button>
            <h1 className="topnav__title">{pageTitle}</h1>
          </div>

          <div className="topnav__right">

            {/* Search */}
            <div className="topnav__search">
              <svg width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" style={{ color: 'var(--gray-400)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input placeholder="Search tickets..." />
            </div>

            {/* Notification Bell */}
            <button className="topnav__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="topnav__notification-dot" />
            </button>

            {/* Avatar */}
            <div className="sidebar__avatar" style={{ width: 34, height: 34, fontSize: 'var(--text-sm)' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="page-content">
          <Outlet />
        </main>

      </div>
    </div>
  )
}