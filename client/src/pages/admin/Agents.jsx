import { useState, useEffect } from 'react'
import api     from '../../api/axios'
import Button  from '../../components/ui/Button'
import Modal   from '../../components/ui/Modal'
import Input   from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import Badge   from '../../components/ui/Badge'

const INIT_FORM = { name: '', email: '', password: '' }

export default function Agents() {
  const [agents, setAgents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(INIT_FORM)
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => { fetchAgents() }, [])

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const res = await api.get('/agents')
      setAgents(res.data.data)
    } catch {
      setError('Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())     errs.name     = 'Name is required'
    if (!form.email.trim())    errs.email    = 'Email is required'
    if (!form.password.trim()) errs.password = 'Password is required'
    if (form.password.length < 8) errs.password = 'Min 8 characters'
    return errs
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setSaving(true)
    try {
      const res = await api.post('/agents', { ...form, role: 'staff' })
      setAgents((p) => [res.data.data, ...p])
      setModal(false)
      setForm(INIT_FORM)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to create agent' })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (agentId) => {
    try {
      const res = await api.patch(`/agents/${agentId}/toggle`)
      setAgents((p) => p.map((a) => a._id === agentId ? res.data.data : a))
    } catch { }
  }

  if (loading) return <Spinner page label="Loading agents..." />

  return (
    <div className="page-enter">

      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Agents</h1>
            <p className="page-header__subtitle">
              {agents.length} support agent{agents.length !== 1 ? 's' : ''} in your team
            </p>
          </div>
          <Button variant="primary" onClick={() => setModal(true)}>+ Add Agent</Button>
        </div>
      </div>

      {error && (
        <div className="alert alert--danger" style={{ marginBottom: 'var(--space-6)' }}>
          ⚠️ {error}
        </div>
      )}

      {agents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">👥</div>
          <p className="empty-state__title">No agents yet</p>
          <p className="empty-state__desc">Create your first support agent to start assigning tickets.</p>
          <Button variant="primary" onClick={() => setModal(true)}>+ Add First Agent</Button>
        </div>
      ) : (
        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent._id} className="agent-card">
              <div className="agent-card__avatar">
                {agent.name?.charAt(0).toUpperCase()}
              </div>
              <div className="agent-card__info">
                <p className="agent-card__name">{agent.name}</p>
                <p className="agent-card__email">{agent.email}</p>
              </div>
              <Badge
                status={agent.isActive ? 'success' : 'closed'}
                label={agent.isActive ? 'Active' : 'Inactive'}
              />
              <div className="agent-card__stats">
                <div className="agent-card__stat">
                  <span className="agent-card__stat-value">{agent.resolvedCount ?? 0}</span>
                  <span className="agent-card__stat-label">Resolved</span>
                </div>
                <div className="agent-card__stat">
                  <span className="agent-card__stat-value">{agent.openCount ?? 0}</span>
                  <span className="agent-card__stat-label">Open</span>
                </div>
              </div>
              <div className="agent-card__actions">
                <Button
                  variant={agent.isActive ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => toggleActive(agent._id)}
                >
                  {agent.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal}
        onClose={() => { setModal(false); setForm(INIT_FORM); setErrors({}) }}
        title="Add New Agent"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleCreate}>
              {saving ? 'Creating...' : 'Create Agent'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Full Name"      name="name"     placeholder="e.g. Ama Owusu"        value={form.name}     onChange={handleChange} error={errors.name}     required />
          <Input label="Email Address"  name="email"    type="email" placeholder="e.g. ama@company.com" value={form.email}    onChange={handleChange} error={errors.email}    required />
          <Input label="Password"       name="password" type="password" placeholder="Min 8 characters"  value={form.password} onChange={handleChange} error={errors.password} hint="Agent will use this to log in" required />
          {errors.submit && <div className="alert alert--danger">⚠️ {errors.submit}</div>}
        </form>
      </Modal>

    </div>
  )
}