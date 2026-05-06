import { useState, useEffect }        from 'react'
import { useParams, useNavigate }     from 'react-router-dom'
import api          from '../../api/axios'
import useAuth      from '../../hooks/useAuth'
import StatusBadge  from '../../components/shared/StatusBadge'
import Button       from '../../components/ui/Button'
import Spinner      from '../../components/ui/Spinner'

const STATUS_OPTIONS = [
  { value: 'open',        label: '🔴 Open'       },
  { value: 'in_progress', label: '🟡 In Progress' },
  { value: 'resolved',    label: '🟢 Resolved'    },
  { value: 'closed',      label: '⚫ Closed'      },
]

const formatDate = (d) => d
  ? new Date(d).toLocaleString('en-GH', {
      day: 'numeric', month: 'short',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  : '—'

export default function TicketDetail() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const { user, isAdmin } = useAuth()

  const [ticket, setTicket]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [reply, setReply]         = useState('')
  const [sending, setSending]     = useState(false)
  const [updating, setUpdating]   = useState(false)
  const [newStatus, setNewStatus] = useState('')
const [agents, setAgents]         = useState([])
const [assigning, setAssigning]   = useState(false)
const [selectedAgent, setSelectedAgent] = useState('')

 useEffect(() => {
  fetchTicket()
  fetchAgents()
}, [id])
  const fetchTicket = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/tickets/${id}`)
      setTicket(res.data.data)
      setNewStatus(res.data.data.status)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }
  const fetchAgents = async () => {
  try {
    const res = await api.get('/agents')
    setAgents(res.data.data)
  } catch { }
}

const handleAssign = async () => {
  if (!selectedAgent) return
  setAssigning(true)
  try {
    const res = await api.patch(`/tickets/${id}/assign`, { agentId: selectedAgent })
    setTicket(res.data.data)
    setSelectedAgent('')
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to assign ticket')
  } finally {
    setAssigning(false)
  }
}


  const handleStatusUpdate = async () => {
    if (newStatus === ticket.status) return
    setUpdating(true)
    try {
      const res = await api.patch(`/tickets/${id}/status`, { status: newStatus })
      setTicket(res.data.data)
      setNewStatus(res.data.data.status)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    try {
      const res = await api.post(`/tickets/${id}/reply`, { message: reply })
      setTicket(res.data.data)
      setReply('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <Spinner page label="Loading ticket..." />

  if (error && !ticket) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">⚠️</div>
        <p className="empty-state__title">Could not load ticket</p>
        <p className="empty-state__desc">{error}</p>
        <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="page-enter">

      <div className="ticket-detail__topbar">
        <button className="ticket-detail__back" onClick={() => navigate(-1)}>← Back</button>
        <div className="ticket-detail__header-right">
          <StatusBadge status={ticket.status} />
          <span className="ticket-detail__id">#{ticket.ticketId}</span>
        </div>
      </div>

      <div className="ticket-detail__layout">

        {/* ── Main Content ── */}
        <div className="ticket-detail__main">

          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <h2 className="ticket-detail__title">{ticket.title}</h2>
            <div className="ticket-detail__meta-row">
              <span className="ticket-detail__meta-item">📁 {ticket.category}</span>
              <span className="ticket-detail__meta-item">🗓️ {formatDate(ticket.createdAt)}</span>
              <span className="ticket-detail__meta-item" style={{
                color: ticket.priority === 'high' ? 'var(--danger)' : ticket.priority === 'medium' ? 'var(--warning)' : 'var(--success)',
                fontWeight: 'var(--weight-semibold)',
              }}>
                ● {ticket.priority?.toUpperCase()} PRIORITY
              </span>
            </div>
            <div className="ticket-detail__divider" />
            <p className="ticket-detail__description">{ticket.description}</p>
          </div>

          <div className="card">
            <div className="card__header">
              <div>
                <p className="card__title">Conversation</p>
                <p className="card__subtitle">{ticket.replies?.length || 0} replies</p>
              </div>
            </div>

            <div className="ticket-replies">
              {ticket.replies?.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                  <div className="empty-state__icon">💬</div>
                  <p className="empty-state__title">No replies yet</p>
                  <p className="empty-state__desc">Be the first to respond.</p>
                </div>
              )}
              {ticket.replies?.map((r, i) => (
                <div key={i} className={`ticket-reply-bubble ${r.author?._id === user?._id ? 'mine' : ''}`}>
                  <div className="ticket-reply-bubble__avatar">
                    {r.author?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="ticket-reply-bubble__content">
                    <div className="ticket-reply-bubble__header">
                      <span className="ticket-reply-bubble__name">{r.author?.name || 'Support Agent'}</span>
                      <span className="ticket-reply-bubble__time">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="ticket-reply-bubble__message">{r.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleReply} className="ticket-reply-form">
              <div className="ticket-reply-form__input-row">
                <div className="ticket-reply-form__avatar">
                  {user?.name?.charAt(0) || 'Y'}
                </div>
                <textarea
                  className="ticket-reply-form__input"
                  placeholder="Type your reply..."
                  rows={3}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
              </div>
              <div className="ticket-reply-form__actions">
                {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)' }}>⚠️ {error}</p>}
                <Button type="submit" variant="primary" loading={sending} disabled={!reply.trim()}>
                  Send Reply →
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="ticket-detail__sidebar">

          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <p className="card__title" style={{ marginBottom: 'var(--space-4)' }}>Update Status</p>
            <select
              className="form-input"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ marginBottom: 'var(--space-3)' }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <Button variant="primary" full loading={updating} onClick={handleStatusUpdate} disabled={newStatus === ticket.status}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>

          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <p className="card__title" style={{ marginBottom: 'var(--space-4)' }}>Customer</p>
            <div className="ticket-detail__customer">
              <div className="ticket-detail__customer-avatar">
                {ticket.customerName?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="ticket-detail__customer-name">{ticket.customerName}</p>
                <p className="ticket-detail__customer-email">{ticket.customerEmail}</p>
                {ticket.customerPhone && (
                  <p className="ticket-detail__customer-email">{ticket.customerPhone}</p>
                )}
              </div>
            </div>
          </div>

        <div className="card">
  <p className="card__title" style={{ marginBottom: 'var(--space-4)' }}>
    Assigned To
  </p>

  {/* Current assignment */}
  {ticket.assignedTo ? (
    <div className="ticket-detail__customer" style={{ marginBottom: 'var(--space-4)' }}>
      <div
        className="ticket-detail__customer-avatar"
        style={{ background: 'var(--success)' }}
      >
        {ticket.assignedTo.name?.charAt(0)}
      </div>
      <div>
        <p className="ticket-detail__customer-name">
          {ticket.assignedTo.name}
        </p>
        <p className="ticket-detail__customer-email">
          {ticket.assignedTo.email}
        </p>
      </div>
    </div>
  ) : (
    <p style={{
      fontSize:  'var(--text-sm)',
      color:     'var(--gray-400)',
      fontStyle: 'italic',
      marginBottom: 'var(--space-4)',
    }}>
      Not yet assigned
    </p>
  )}

  {/* Assign dropdown — admin only */}
  {isAdmin && agents.length > 0 && (
    <>
      <select
        className="form-input"
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
        style={{ marginBottom: 'var(--space-3)' }}
      >
        <option value="">Select an agent...</option>
        {agents.map((a) => (
          <option key={a._id} value={a._id}>
            {a.name}
          </option>
        ))}
      </select>
      <Button
        variant="secondary"
        full
        loading={assigning}
        onClick={handleAssign}
        disabled={!selectedAgent}
      >
        {assigning ? 'Assigning...' : 'Assign Ticket'}
      </Button>
    </>
  )}

  {/* No agents created yet */}
  {isAdmin && agents.length === 0 && (
    <p style={{
      fontSize:  'var(--text-xs)',
      color:     'var(--gray-400)',
      marginTop: 'var(--space-2)',
    }}>
      No agents available. Create agents first.
    </p>
  )}
</div>

        </div>
      </div>
    </div>
  )
}