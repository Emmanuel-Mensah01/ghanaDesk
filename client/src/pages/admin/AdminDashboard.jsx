import { useState, useEffect } from 'react'
import { Link }                from 'react-router-dom'
import api                     from '../../api/axios'
import StatsCard               from '../../components/shared/StatsCard'
import TicketTable             from '../../components/shared/TicketTable'
import Spinner                 from '../../components/ui/Spinner'
import Button                  from '../../components/ui/Button'

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [tickets, setTickets] = useState([])
  const [agents, setAgents]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [sRes, tRes, aRes] = await Promise.all([
        api.get('/stats/admin'),
        api.get('/tickets?limit=8'),
        api.get('/agents?limit=5'),
      ])
      setStats(sRes.data.data)
      setTickets(tRes.data.data)
      setAgents(aRes.data.data)
    } catch {
      // fail silently — empty state handles it
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
            <h1 className="page-header__title">Admin Dashboard</h1>
            <p className="page-header__subtitle">Full overview of your support operations</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/admin/agents">
              <Button variant="secondary">Manage Agents</Button>
            </Link>
            <Link to="/admin/tickets">
              <Button variant="primary">All Tickets</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Tickets" value={stats?.total ?? '—'}      icon="🎫" iconBg="var(--primary-light)"  iconColor="var(--primary)"      />
        <StatsCard label="Open"          value={stats?.open ?? '—'}       icon="🔴" iconBg="var(--danger-bg)"      iconColor="var(--danger)"       />
        <StatsCard label="In Progress"   value={stats?.inProgress ?? '—'} icon="🔧" iconBg="var(--warning-bg)"     iconColor="var(--warning)"      />
        <StatsCard label="Resolved"      value={stats?.resolved ?? '—'}   icon="✅" iconBg="var(--success-bg)"     iconColor="var(--success)"      />
        <StatsCard label="Total Agents"  value={stats?.agents ?? '—'}     icon="👥" iconBg="var(--info-bg)"        iconColor="var(--info)"         />
        <StatsCard label="Avg. Response" value={stats?.avgResponse ?? '—'}icon="⚡" iconBg="var(--accent-light)"   iconColor="var(--accent-dark)"  />
      </div>

      <div className="data-grid data-grid--two" style={{ gap: 'var(--space-6)' }}>

        <div className="dash-section">
          <div className="dash-section__header">
            <div>
              <h2 className="dash-section__title">Recent Tickets</h2>
              <p className="dash-section__subtitle">Latest incoming requests</p>
            </div>
            <Link to="/admin/tickets">
              <Button variant="ghost" size="sm">See all →</Button>
            </Link>
          </div>
          <TicketTable tickets={tickets.slice(0, 5)} />
        </div>

        <div className="dash-section">
          <div className="dash-section__header">
            <div>
              <h2 className="dash-section__title">Agent Performance</h2>
              <p className="dash-section__subtitle">Top agents this month</p>
            </div>
            <Link to="/admin/agents">
              <Button variant="ghost" size="sm">See all →</Button>
            </Link>
          </div>

          <div className="agent-perf-list">
            {agents.length === 0 && (
              <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                <div className="empty-state__icon">👥</div>
                <p className="empty-state__title">No agents yet</p>
                <p className="empty-state__desc">Add agents to see performance here.</p>
              </div>
            )}
            {agents.map((agent, i) => (
              <div key={agent._id} className="agent-perf-row">
                <span className="agent-perf-rank">#{i + 1}</span>
                <div className="agent-perf-info">
                  <div className="agent-perf-avatar">
                    {agent.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="agent-perf-name">{agent.name}</p>
                    <p className="agent-perf-email">{agent.email}</p>
                  </div>
                </div>
                <div className="agent-perf-stats">
                  <div className="agent-perf-stat">
                    <span className="agent-perf-stat__value">{agent.resolvedCount ?? 0}</span>
                    <span className="agent-perf-stat__label">resolved</span>
                  </div>
                  <div className="agent-perf-stat">
                    <span className="agent-perf-stat__value">{agent.openCount ?? 0}</span>
                    <span className="agent-perf-stat__label">open</span>
                  </div>
                </div>
                <div className="agent-perf-status" style={{
                  background: agent.isActive ? 'var(--success)' : 'var(--gray-300)',
                }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}