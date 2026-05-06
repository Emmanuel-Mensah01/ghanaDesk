// src/components/shared/TicketCard.jsx
// ─────────────────────────────────────────
// Ticket preview card — used in list views
// Shows ID, title, preview, status, date
// ─────────────────────────────────────────

import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import useAuth from '../../hooks/useAuth'

// Format date nicely
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GH', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

export default function TicketCard({ ticket }) {
  const navigate    = useNavigate()
  const { isAdmin } = useAuth()

  if (!ticket) return null

  const handleClick = () => {
    // Admin goes to admin view, staff to staff view
    const base = isAdmin ? '/admin/tickets' : '/staff/tickets'
    navigate(`${base}/${ticket._id}`)
  }

  return (
    <div className="ticket-card" onClick={handleClick}>

      {/* Top — ticket ID + status */}
      <div className="ticket-card__top">
        <span className="ticket-card__id">
          #{ticket.ticketId || ticket._id?.slice(-6).toUpperCase()}
        </span>
        <StatusBadge status={ticket.status} />
      </div>

      {/* Title */}
      <p className="ticket-card__title">{ticket.title}</p>

      {/* Description preview */}
      <p className="ticket-card__preview">{ticket.description}</p>

      {/* Footer — category + date */}
      <div className="ticket-card__footer">
        <div className="ticket-card__meta">

          {/* Category */}
          {ticket.category && (
            <span className="ticket-card__meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              {ticket.category}
            </span>
          )}

          {/* Assigned agent */}
          {ticket.assignedTo?.name && (
            <span className="ticket-card__meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {ticket.assignedTo.name}
            </span>
          )}

        </div>

        {/* Date */}
        <span className="ticket-card__meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {formatDate(ticket.createdAt)}
        </span>

      </div>
    </div>
  )
}