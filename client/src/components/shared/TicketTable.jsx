// src/components/shared/TicketTable.jsx

import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import Spinner from '../ui/Spinner'
import useAuth from '../../hooks/useAuth'

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GH', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

const PRIORITY_COLORS = {
  low:    'var(--success)',
  medium: 'var(--warning)',
  high:   'var(--danger)',
}

export default function TicketTable({
  tickets  = [],
  loading  = false,
}) {
  const navigate    = useNavigate()
  const { isAdmin } = useAuth()

  // ── Navigate on row click ──
  const handleRow = (ticket) => {
    const path = isAdmin
      ? `/admin/tickets/${ticket._id}`
      : `/staff/tickets/${ticket._id}`
    console.log('Navigating to:', path)
    navigate(path)
  }

  if (loading) {
    return (
      <div className="table-wrapper" style={{ padding: 'var(--space-16)' }}>
        <Spinner page label="Loading tickets..." />
      </div>
    )
  }

  if (!tickets.length) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state__icon">🎫</div>
          <p className="empty-state__title">No tickets found</p>
          <p className="empty-state__desc">
            Tickets submitted through the portal will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Customer</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket._id}
              onClick={() => handleRow(ticket)}
              style={{ cursor: 'pointer' }}
            >
              <td>
                <span style={{
                  fontFamily:   'var(--font-mono)',
                  fontSize:     'var(--text-xs)',
                  fontWeight:   'var(--weight-bold)',
                  color:        'var(--primary)',
                  background:   'var(--primary-light)',
                  padding:      '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  #{ticket.ticketId || ticket._id?.slice(-6).toUpperCase()}
                </span>
              </td>

              <td style={{
                maxWidth:     '220px',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
                fontWeight:   'var(--weight-medium)',
                color:        'var(--gray-900)',
              }}>
                {ticket.title}
              </td>

              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 'var(--weight-medium)', color: 'var(--gray-800)' }}>
                    {ticket.customerName || '—'}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>
                    {ticket.customerEmail || ''}
                  </span>
                </div>
              </td>

              <td style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
                {ticket.category || '—'}
              </td>

              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{
                    width:        '8px',
                    height:       '8px',
                    borderRadius: '50%',
                    background:   PRIORITY_COLORS[ticket.priority] || 'var(--gray-300)',
                    flexShrink:   0,
                  }} />
                  <span style={{
                    fontSize:      'var(--text-sm)',
                    textTransform: 'capitalize',
                    color:         'var(--gray-600)',
                  }}>
                    {ticket.priority || 'low'}
                  </span>
                </div>
              </td>

              <td>
                <StatusBadge status={ticket.status} />
              </td>

              <td>
                {ticket.assignedTo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                      width:         '26px',
                      height:        '26px',
                      borderRadius:  '50%',
                      background:    'var(--primary)',
                      display:       'flex',
                      alignItems:    'center',
                      justifyContent:'center',
                      color:         'var(--white)',
                      fontSize:      '10px',
                      fontWeight:    'var(--weight-bold)',
                      flexShrink:    0,
                    }}>
                      {ticket.assignedTo.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}>
                      {ticket.assignedTo.name}
                    </span>
                  </div>
                ) : (
                  <span style={{
                    fontSize:  'var(--text-xs)',
                    color:     'var(--gray-400)',
                    fontStyle: 'italic',
                  }}>
                    Unassigned
                  </span>
                )}
              </td>

              <td style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                {formatDate(ticket.createdAt)}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}