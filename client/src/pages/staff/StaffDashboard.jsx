import { useState, useEffect } from 'react'
import { Link }                from 'react-router-dom'
import api                     from '../../api/axios'
import useAuth                 from '../../hooks/useAuth'
import StatsCard               from '../../components/shared/StatsCard'
import TicketCard              from '../../components/shared/TicketCard'
import Spinner                 from '../../components/ui/Spinner'
import Button                  from '../../components/ui/Button'

export default function StaffDashboard() {
  const { user }              = useAuth()
  const [stats, setStats]     = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        api.get('/stats/staff'),
        api.get('/tickets/my?limit=6'),
      ])
      setStats(statsRes.data.data)
      setTickets(ticketsRes.data.data)
    } catch {
      setError('Failed to load dashboard. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner page label="Loading dashboard..." />

  return (
    <div className="page-enter">

      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">
              Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="page-header__subtitle">
              Here's what's on your plate today.
            </p>
          </div>
          <Link to="/staff/tickets">
            <Button variant="primary">View All Tickets</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert--danger" style={{ marginBottom: 'var(--space-6)' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="stats-grid">
        <StatsCard
          label="Assigned to Me"
          value={stats?.assigned ?? '—'}
          icon="🎫"
          iconBg="var(--primary-light)"
          iconColor="var(--primary)"
        />
        <StatsCard
          label="Open"
          value={stats?.open ?? '—'}
          icon="🔴"
          iconBg="var(--danger-bg)"
          iconColor="var(--danger)"
        />
        <StatsCard
          label="In Progress"
          value={stats?.inProgress ?? '—'}
          icon="🔧"
          iconBg="var(--warning-bg)"
          iconColor="var(--warning)"
        />
        <StatsCard
          label="Resolved Today"
          value={stats?.resolvedToday ?? '—'}
          icon="✅"
          iconBg="var(--success-bg)"
          iconColor="var(--success)"
        />
      </div>

      <div className="dash-section">
        <div className="dash-section__header">
          <div>
            <h2 className="dash-section__title">My Recent Tickets</h2>
            <p className="dash-section__subtitle">Your latest assigned requests</p>
          </div>
          <Link to="/staff/tickets">
            <Button variant="ghost" size="sm">See all →</Button>
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎉</div>
            <p className="empty-state__title">All clear!</p>
            <p className="empty-state__desc">No assigned tickets right now.</p>
          </div>
        ) : (
          <div className="ticket-cards-grid">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}