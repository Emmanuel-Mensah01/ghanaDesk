// src/pages/public/TrackTicket.jsx
// ─────────────────────────────────────────
// Customer enters their ticket ID and
// sees full status timeline + details
// ─────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/shared/StatusBadge'

// Format date nicely
const formatDate = (d) => d
  ? new Date(d).toLocaleString('en-GH', {
      day: 'numeric', month: 'short',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  : '—'

// ── Timeline steps config ──
const TIMELINE_STEPS = [
  { key: 'open',        label: 'Ticket Submitted',    icon: '📝' },
  { key: 'in_progress', label: 'Being Worked On',     icon: '🔧' },
  { key: 'resolved',    label: 'Issue Resolved',      icon: '✅' },
  { key: 'closed',      label: 'Ticket Closed',       icon: '🔒' },
]

const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed']

export default function TrackTicket() {

  const [searchParams]        = useSearchParams()
  const [ticketId, setTicketId] = useState(searchParams.get('id') || '')
  const [ticket, setTicket]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // ── Auto-search if ID in URL ──
  useEffect(() => {
    if (searchParams.get('id')) handleSearch()
  }, [])

  // ── Search handler ──
  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!ticketId.trim()) return setError('Please enter a Ticket ID')

    setLoading(true)
    setError('')
    setTicket(null)

    try {
      const res  = await fetch(`/api/v1/tickets/track/${ticketId.trim()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Ticket not found')

      setTicket(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Current step index ──
  const currentStep = ticket
    ? STATUS_ORDER.indexOf(ticket.status)
    : -1

  return (
    <div className="track-page page-enter">
      <div className="container">

        {/* ── Page Header ── */}
        <div className="track-header">
          <h1 className="track-header__title">Track Your Ticket</h1>
          <p className="track-header__desc">
            Enter your Ticket ID to see the current status and updates
            on your support request.
          </p>
        </div>

        {/* ── Search Box ── */}
        <div className="track-search-wrapper">
          <form className="track-search" onSubmit={handleSearch}>
            <div className="track-search__input-wrap">
              <span className="track-search__icon">🔍</span>
              <input
                type="text"
                className="track-search__input"
                placeholder="Enter your Ticket ID — e.g. GHD-A1B2C3"
                value={ticketId}
                onChange={(e) => {
                  setTicketId(e.target.value)
                  setError('')
                }}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
            >
              {loading ? 'Searching...' : 'Track Ticket'}
            </Button>
          </form>

          {error && (
            <div className="alert alert--danger" style={{ marginTop: 'var(--space-4)' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ── Ticket Result ── */}
        {ticket && (
          <div className="track-result page-enter">

            {/* ── Result Header ── */}
            <div className="track-result__header">
              <div className="track-result__id-block">
                <span className="track-result__id-label">Ticket ID</span>
                <span className="track-result__id-value">#{ticket.ticketId}</span>
              </div>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="track-result__body">

              {/* ── Timeline ── */}
              <div className="track-timeline-card">
                <h3 className="track-section-title">Status Timeline</h3>
                <div className="track-timeline">
                  {TIMELINE_STEPS.map((step, i) => {
                    const done    = i <= currentStep
                    const current = i === currentStep
                    return (
                      <div
                        key={step.key}
                        className={`track-timeline__step
                          ${done    ? 'done'    : ''}
                          ${current ? 'current' : ''}
                        `}
                      >
                        {/* Connector line */}
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div className={`track-timeline__line ${done ? 'done' : ''}`} />
                        )}

                        {/* Icon */}
                        <div className="track-timeline__icon">
                          {done ? step.icon : '○'}
                        </div>

                        {/* Label */}
                        <div className="track-timeline__label">
                          <p className="track-timeline__label-title">{step.label}</p>
                          {current && (
                            <p className="track-timeline__label-current">Current Status</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Ticket Details ── */}
              <div className="track-details-card">
                <h3 className="track-section-title">Ticket Details</h3>

                <div className="track-details">

                  <div className="track-detail-row">
                    <span className="track-detail-label">Title</span>
                    <span className="track-detail-value">{ticket.title}</span>
                  </div>

                  <div className="track-detail-row">
                    <span className="track-detail-label">Category</span>
                    <span className="track-detail-value" style={{ textTransform: 'capitalize' }}>
                      {ticket.category}
                    </span>
                  </div>

                  <div className="track-detail-row">
                    <span className="track-detail-label">Priority</span>
                    <span className="track-detail-value" style={{
                      textTransform: 'capitalize',
                      color: ticket.priority === 'high'
                        ? 'var(--danger)'
                        : ticket.priority === 'medium'
                        ? 'var(--warning)'
                        : 'var(--success)',
                      fontWeight: 'var(--weight-semibold)',
                    }}>
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="track-detail-row">
                    <span className="track-detail-label">Submitted</span>
                    <span className="track-detail-value">{formatDate(ticket.createdAt)}</span>
                  </div>

                  {ticket.assignedTo && (
                    <div className="track-detail-row">
                      <span className="track-detail-label">Assigned To</span>
                      <span className="track-detail-value">{ticket.assignedTo.name}</span>
                    </div>
                  )}

                  <div className="track-detail-row track-detail-row--full">
                    <span className="track-detail-label">Description</span>
                    <p className="track-detail-desc">{ticket.description}</p>
                  </div>

                </div>

                {/* ── Replies ── */}
                {ticket.replies?.length > 0 && (
                  <div className="track-replies">
                    <h4 className="track-replies__title">
                      Updates from Support Team
                    </h4>
                    {ticket.replies.map((reply, i) => (
                      <div key={i} className="track-reply">
                        <div className="track-reply__header">
                          <div className="track-reply__avatar">
                            {reply.author?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="track-reply__name">
                              {reply.author?.name || 'Support Agent'}
                            </p>
                            <p className="track-reply__time">
                              {formatDate(reply.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="track-reply__message">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ── Empty state before search ── */}
        {!ticket && !loading && !error && (
          <div className="track-empty">
            <div className="track-empty__icon">🎫</div>
            <p className="track-empty__title">Enter your Ticket ID above</p>
            <p className="track-empty__desc">
              Your Ticket ID was sent to you after submitting your support
              request. It looks like <strong>GHD-A1B2C3</strong>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}