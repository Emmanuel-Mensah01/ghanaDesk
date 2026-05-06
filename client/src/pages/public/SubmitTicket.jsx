// src/pages/public/SubmitTicket.jsx
// ─────────────────────────────────────────
// Public form — any customer can submit
// a support ticket. No account needed.
// ─────────────────────────────────────────

import { useState } from 'react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

// ── Ticket categories ──
const CATEGORIES = [
  { value: 'technical',  label: 'Technical Issue' },
  { value: 'billing',    label: 'Billing & Payments' },
  { value: 'account',    label: 'Account Access' },
  { value: 'network',    label: 'Network & Connectivity' },
  { value: 'hardware',   label: 'Hardware Problem' },
  { value: 'software',   label: 'Software / App Issue' },
  { value: 'general',    label: 'General Inquiry' },
  { value: 'other',      label: 'Other' },
]

const PRIORITIES = [
  { value: 'low',    label: '🟢 Low — Not urgent' },
  { value: 'medium', label: '🟡 Medium — Needs attention' },
  { value: 'high',   label: '🔴 High — Urgent issue' },
]

// ── Initial form state ──
const INITIAL_FORM = {
  customerName:  '',
  customerEmail: '',
  customerPhone: '',
  category:      '',
  priority:      'medium',
  title:         '',
  description:   '',
}

export default function SubmitTicket() {

  const [form, setForm]       = useState(INITIAL_FORM)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)  // holds created ticket data

  // ── Handle input change ──
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // ── Validate ──
  const validate = () => {
    const errs = {}
    if (!form.customerName.trim())  errs.customerName  = 'Your name is required'
    if (!form.customerEmail.trim()) errs.customerEmail = 'Your email is required'
    if (!/\S+@\S+\.\S+/.test(form.customerEmail)) errs.customerEmail = 'Enter a valid email'
    if (!form.category)             errs.category      = 'Please select a category'
    if (!form.title.trim())         errs.title         = 'A short title is required'
    if (!form.description.trim())   errs.description   = 'Please describe your issue'
    if (form.description.trim().length < 20) errs.description = 'Please provide more detail (min 20 characters)'
    return errs
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const res = await fetch('/api/v1/tickets', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Something went wrong')

      setSuccess(data.data)   // store ticket for success screen
      setForm(INITIAL_FORM)

    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  // ══════════════════════════════════════
  // SUCCESS SCREEN
  // ══════════════════════════════════════
  if (success) {
    return (
      <div className="submit-page page-enter">
        <div className="container">
          <div className="submit-success">

            <div className="submit-success__icon">✅</div>

            <h2 className="submit-success__title">Ticket Submitted!</h2>
            <p className="submit-success__desc">
              Your support request has been received. Save your ticket ID below
              to track your request status.
            </p>

            <div className="submit-success__id-box">
              <p className="submit-success__id-label">Your Ticket ID</p>
              <p className="submit-success__id-value">
                #{success.ticketId}
              </p>
              <p className="submit-success__id-hint">
                Use this ID to track your ticket at any time
              </p>
            </div>

            <div className="submit-success__actions">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = `/track-ticket?id=${success.ticketId}`}
              >
                Track My Ticket
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setSuccess(null)}
              >
                Submit Another
              </Button>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════
  // FORM
  // ══════════════════════════════════════
  return (
    <div className="submit-page page-enter">
      <div className="container">
        <div className="submit-layout">

          {/* ── Left — Info Panel ── */}
          <div className="submit-info">

            <div className="submit-info__badge">Support Center</div>

            <h1 className="submit-info__title">
              How can we help you?
            </h1>
            <p className="submit-info__desc">
              Fill in the form and our support team will get back to
              you as quickly as possible.
            </p>

            {/* Steps */}
            <div className="submit-info__steps">
              {[
                { icon: '📝', title: 'Fill the form',      desc: 'Tell us what the issue is' },
                { icon: '📨', title: 'Get a Ticket ID',    desc: 'Save it to track your request' },
                { icon: '🔔', title: 'We respond fast',    desc: 'Usually within 2 hours' },
              ].map((step) => (
                <div key={step.title} className="submit-info__step">
                  <div className="submit-info__step-icon">{step.icon}</div>
                  <div>
                    <p className="submit-info__step-title">{step.title}</p>
                    <p className="submit-info__step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact note */}
            <div className="submit-info__note">
              <p>📞 Emergency? Call us directly</p>
              <p style={{ fontWeight: 'var(--weight-bold)', color: 'var(--gray-900)' }}>
                +233 XX XXX XXXX
              </p>
            </div>

          </div>

          {/* ── Right — Form ── */}
          <div className="submit-form-wrapper">
            <div className="submit-form-card">

              <div className="submit-form-card__header">
                <h2 className="submit-form-card__title">Submit a Support Ticket</h2>
                <p className="submit-form-card__subtitle">
                  All fields marked <span style={{ color: 'var(--danger)' }}>*</span> are required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="submit-form">

                {/* Name + Email row */}
                <div className="submit-form__row">
                  <Input
                    label="Full Name"
                    name="customerName"
                    placeholder="e.g. Kofi Mensah"
                    value={form.customerName}
                    onChange={handleChange}
                    error={errors.customerName}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="customerEmail"
                    type="email"
                    placeholder="e.g. kofi@gmail.com"
                    value={form.customerEmail}
                    onChange={handleChange}
                    error={errors.customerEmail}
                    required
                  />
                </div>

                {/* Phone */}
                <Input
                  label="Phone Number"
                  name="customerPhone"
                  type="tel"
                  placeholder="e.g. 0244 123 456"
                  value={form.customerPhone}
                  onChange={handleChange}
                  hint="Optional — for urgent follow-ups"
                />

                {/* Category + Priority row */}
                <div className="submit-form__row">
                  <Input
                    label="Category"
                    name="category"
                    type="select"
                    placeholder="Select a category"
                    value={form.category}
                    onChange={handleChange}
                    error={errors.category}
                    options={CATEGORIES}
                    required
                  />
                  <Input
                    label="Priority"
                    name="priority"
                    type="select"
                    value={form.priority}
                    onChange={handleChange}
                    options={PRIORITIES}
                  />
                </div>

                {/* Title */}
                <Input
                  label="Issue Title"
                  name="title"
                  placeholder="e.g. Cannot log into student portal"
                  value={form.title}
                  onChange={handleChange}
                  error={errors.title}
                  hint="Keep it short and clear"
                  required
                />

                {/* Description */}
                <Input
                  label="Describe Your Issue"
                  name="description"
                  type="textarea"
                  rows={5}
                  placeholder="Please describe the issue in detail. Include what you were doing, what happened, and any error messages you saw..."
                  value={form.description}
                  onChange={handleChange}
                  error={errors.description}
                  required
                />

                {/* Submit error */}
                {errors.submit && (
                  <div className="alert alert--danger">
                    ⚠️ {errors.submit}
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  full
                  loading={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Ticket →'}
                </Button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}