// src/pages/auth/Login.jsx
// ─────────────────────────────────────────
// Staff + Admin login page
// JWT auth — redirects by role on success
// ─────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import useAuth   from '../../hooks/useAuth'
import Input     from '../../components/ui/Input'
import Button    from '../../components/ui/Button'
import API_BASE from '../../config'

export default function Login() {

  const navigate              = useNavigate()
  const { login, isAuthenticated, user } = useAuth()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  // ── Redirect if already logged in ──
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/staff', { replace: true })
    }
  }, [isAuthenticated])

  // ── Handle change ──
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // ── Validate ──
  const validate = () => {
    const errs = {}
    if (!form.email.trim())    errs.email    = 'Email is required'
    if (!form.password.trim()) errs.password = 'Password is required'
    return errs
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Login failed')

      // Save to context + localStorage
      login(data.data.user, data.data.token)

      // Redirect by role
      navigate(data.data.user.role === 'admin' ? '/admin' : '/staff', { replace: true })

    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page page-enter">

      {/* ── Left Panel ── */}
      <div className="login-panel login-panel--left">

        <div className="login-brand">
          <div className="login-brand__icon">G</div>
          <div>
            <p className="login-brand__name">GhanaDesk</p>
            <p className="login-brand__tagline">Support Management Portal</p>
          </div>
        </div>

        <div className="login-illustration">
          <div className="login-illustration__card">
            <p className="login-illustration__greeting">👋 Welcome back</p>
            <p className="login-illustration__text">
              Log in to manage support tickets, respond to customers,
              and keep your team on track.
            </p>

            {/* Fake stat pills */}
            <div className="login-illustration__stats">
              {[
                { icon: '🎫', label: '12 Open Tickets'    },
                { icon: '✅', label: '5 Resolved Today'   },
                { icon: '👥', label: '3 Agents Online'    },
              ].map((s) => (
                <div key={s.label} className="login-illustration__stat">
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="login-panel__footer">
          © {new Date().getFullYear()} GhanaDesk · EM Control IT Solutions
        </p>

      </div>

      {/* ── Right Panel — Form ── */}
      <div className="login-panel login-panel--right">
        <div className="login-form-wrapper">

          {/* Header */}
          <div className="login-form__header">
            <h1 className="login-form__title">Sign in to your account</h1>
            <p className="login-form__subtitle">
              Staff and Admin access only.{' '}
              <Link to="/" className="login-form__link">
                Back to portal →
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="yourname@company.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              {/* Toggle password visibility */}
              <button
                type="button"
                className="login-form__pass-toggle"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="alert alert--danger">
                ⚠️ {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              full
              loading={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </Button>

          </form>

          {/* Demo credentials hint */}
          <div className="login-demo-hint">
            <p className="login-demo-hint__title">Demo Credentials</p>
            <div className="login-demo-hint__row">
              <span>Admin:</span>
              <code>admin@ghanaDesk.com</code>
              <span>/</span>
              <code>Admin@1234</code>
            </div>
            <div className="login-demo-hint__row">
              <span>Staff:</span>
              <code>staff@ghanaDesk.com</code>
              <span>/</span>
              <code>Staff@1234</code>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}