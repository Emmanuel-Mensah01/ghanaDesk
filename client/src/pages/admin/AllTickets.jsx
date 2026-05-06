import { useState, useEffect } from 'react'
import api                     from '../../api/axios'
import TicketTable             from '../../components/shared/TicketTable'
import Button                  from '../../components/ui/Button'

const STATUS_FILTERS = [
  { label: 'All',         value: ''            },
  { label: 'Open',        value: 'open'        },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved',    value: 'resolved'    },
  { label: 'Closed',      value: 'closed'      },
]

const PRIORITY_FILTERS = [
  { label: 'All Priority', value: ''       },
  { label: 'High',         value: 'high'   },
  { label: 'Medium',       value: 'medium' },
  { label: 'Low',          value: 'low'    },
]

export default function AllTickets() {
  const [tickets, setTickets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [priority, setPriority] = useState('')
  const [error, setError]       = useState('')

  useEffect(() => { fetchTickets() }, [status, priority])

  const fetchTickets = async () => {
    setLoading(true)
    setError('')
    try {
      const query = new URLSearchParams()
      if (status)   query.set('status',   status)
      if (priority) query.set('priority', priority)
      const res = await api.get(`/tickets?${query}`)
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
    t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    t.customerEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-enter">

      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">All Tickets</h1>
            <p className="page-header__subtitle">{tickets.length} total tickets</p>
          </div>
          <Button variant="secondary" onClick={fetchTickets}>↻ Refresh</Button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filters-bar__search">
          <span className="filters-bar__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tickets, customers, IDs..."
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
        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '140px' }}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {PRIORITY_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
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