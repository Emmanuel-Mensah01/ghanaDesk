// src/pages/admin/Settings.jsx
// ─────────────────────────────────────────
// Admin settings — company info,
// ticket categories, account details
// ─────────────────────────────────────────

import { useState } from 'react'
import useAuth  from '../../hooks/useAuth'
import Input    from '../../components/ui/Input'
import Button   from '../../components/ui/Button'
import Card     from '../../components/ui/Card'

export default function Settings() {
  const { user, token }         = useAuth()
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  const [profile, setProfile]   = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    company: user?.company || 'GhanaDesk',
  })

  const [passwords, setPasswords] = useState({
    current:  '',
    newPass:  '',
    confirm:  '',
  })

  const [passError, setPassError] = useState('')

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((p) => ({ ...p, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswords((p) => ({ ...p, [name]: value }))
    setPassError('')
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/v1/auth/profile', {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* fail silently */ }
    finally { setSaving(false) }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (passwords.newPass !== passwords.confirm) {
      return setPassError('Passwords do not match')
    }
    if (passwords.newPass.length < 8) {
      return setPassError('Password must be at least 8 characters')
    }
    setSaving(true)
    try {
      const res  = await fetch('/api/v1/auth/change-password', {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword:     passwords.newPass,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setPasswords({ current: '', newPass: '', confirm: '' })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setPassError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-enter">

      {/* ── Header ── */}
      <div className="page-header">
        <h1 className="page-header__title">Settings</h1>
        <p className="page-header__subtitle">
          Manage your account and system preferences
        </p>
      </div>

      {saved && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-6)' }}>
          ✅ Changes saved successfully
        </div>
      )}

      <div className="settings-layout">

        {/* ── Profile ── */}
        <Card
          title="Profile Information"
          subtitle="Update your name, email and company"
        >
          <form onSubmit={handleProfileSave} className="settings-form">
            <Input
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              required
            />
            <Input
              label="Company / Organization Name"
              name="company"
              value={profile.company}
              onChange={handleProfileChange}
              hint="Shown on the public portal"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary" loading={saving}>
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* ── Password ── */}
        <Card
          title="Change Password"
          subtitle="Keep your account secure"
        >
          <form onSubmit={handlePasswordSave} className="settings-form">
            <Input
              label="Current Password"
              name="current"
              type="password"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="New Password"
              name="newPass"
              type="password"
              placeholder="Min 8 characters"
              value={passwords.newPass}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Confirm New Password"
              name="confirm"
              type="password"
              placeholder="Repeat new password"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              error={passError}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary" loading={saving}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* ── Danger Zone ── */}
        <Card title="System Info" subtitle="Read-only system details">
          <div className="settings-info-grid">
            {[
              { label: 'Version',       value: 'GhanaDesk v1.0.0'    },
              { label: 'Built by',      value: 'EM Control IT Solutions' },
              { label: 'Your Role',     value: user?.role || '—'     },
              { label: 'Account Email', value: user?.email || '—'    },
            ].map((item) => (
              <div key={item.label} className="settings-info-row">
                <span className="settings-info-label">{item.label}</span>
                <span className="settings-info-value">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}