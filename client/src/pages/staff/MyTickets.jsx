import { useState, useEffect } from 'react'
import api        from '../../api/axios'
import TicketTable from '../../components/shared/TicketTable'
import Button     from '../../components/ui/Button'

const STATUS_FILTERS = [
  { label: 'All',         value: ''            },
  { label: 'Open',        value: 'open'        },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved',    value: 'resolved'    },
  { label: 'Closed',      value: 'closed'      },
]

export default function MyTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('')
  const [error, setError]     = useState('')

  useEffect(() => { fetchTickets() }, [status])

  const fetchTickets = async () => {
    setLoading(true)
    setError('')
    try {
      const query = new URLSearchParams()
      if (status) query.set('status', status)
      const res = await api.get(`/tickets/my?${query}`)
      setTickets(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const filtered = tickets.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase())        ||
    t.ticketId?.toLowerCase().includes(search.toLowerCase())     ||
    t.customerName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-enter">

      <div className="page-header">
        <h1 className="page-header__title">My Tickets</h1>
        <p className="page-header__subtitle">All support tickets assigned to you</p>
      </div>

      <div className="filters-bar">
        <div className="filters-bar__search">
          <span className="filters-bar__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title, ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filters-bar__search-input"
          />
        </div>
        <div className="filters-bar__pills">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-pill ${status === f.value ? 'active' : ''}`}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={fetchTickets}>↻ Refresh</Button>
      </div>

      {error && (
        <div className="alert alert--danger" style={{ marginBottom: 'var(--space-4)' }}>
          ⚠️ {error}
        </div>
      )}

      <TicketTable tickets={filtered} loading={loading} />

      {!loading && (
        <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--gray-400)', textAlign: 'right' }}>
          Showing {filtered.length} of {tickets.length} tickets
        </p>
      )}
    </div>
  )
}