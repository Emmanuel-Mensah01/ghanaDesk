// src/components/layout/Sidebar.jsx
// ─────────────────────────────────────────
// Dashboard sidebar — role-aware nav links
// Admin sees all, Staff sees their section
// ─────────────────────────────────────────

import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

// ── Nav config per role ──
const STAFF_LINKS = [
  {
    section: 'Main',
    links: [
      { label: 'Dashboard', path: '/staff',         icon: '⊞' },
      { label: 'My Tickets', path: '/staff/tickets', icon: '🎫' },
    ],
  },
]

const ADMIN_LINKS = [
  {
    section: 'Overview',
    links: [
      { label: 'Dashboard',   path: '/admin',          icon: '⊞' },
      { label: 'All Tickets', path: '/admin/tickets',  icon: '🎫' },
    ],
  },
  {
    section: 'Management',
    links: [
      { label: 'Agents',   path: '/admin/agents',   icon: '👥' },
      { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
    ],
  },
]

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const location                  = useLocation()
  const navigate                  = useNavigate()

  const navGroups = isAdmin ? ADMIN_LINKS : STAFF_LINKS

  // ── Get initials from name ──
  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">

      {/* ── Logo ── */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <span>G</span>
        </div>
        <div className="sidebar__logo-text">
          <span className="sidebar__logo-name">GhanaDesk</span>
          <span className="sidebar__logo-tagline">
            {isAdmin ? 'Admin Portal' : 'Staff Portal'}
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar__nav">
        {navGroups.map((group) => (
          <div key={group.section}>

            {/* Section Label */}
            <p className="sidebar__section-label">{group.section}</p>

            {/* Links */}
            {group.links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar__link
                  ${location.pathname === link.path ? 'active' : ''}
                `}
              >
                <span className="sidebar__link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

          </div>
        ))}

        {/* ── Quick Action ── */}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)' }}>
          <p className="sidebar__section-label">Quick Access</p>
          <Link to="/" className="sidebar__link" target="_blank">
            <span className="sidebar__link-icon">🌐</span>
            <span>Public Portal</span>
          </Link>
        </div>

      </nav>

      {/* ── User Footer ── */}
      <div className="sidebar__footer">
        <div className="sidebar__user" onClick={handleLogout} title="Click to logout">
          <div className="sidebar__avatar">
            {getInitials(user?.name)}
          </div>
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">{user?.name || 'Agent'}</p>
            <p className="sidebar__user-role">{user?.role || 'staff'} · logout</p>
          </div>
        </div>
      </div>

    </aside>
  )
}