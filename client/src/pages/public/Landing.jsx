// src/pages/public/Landing.jsx
// ─────────────────────────────────────────
// Public hero page — first thing every
// visitor sees. Clean, confident, Ghana-built
// ─────────────────────────────────────────

import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

// ── Stats data ──
const STATS = [
  { value: '99%',    label: 'Customer Satisfaction' },
  { value: '< 2hrs', label: 'Average Response Time' },
  { value: '500+',   label: 'Tickets Resolved' },
  { value: '24/7',   label: 'Portal Availability' },
]

// ── Features data ──
const FEATURES = [
  {
    icon: '🎫',
    title: 'Easy Ticket Submission',
    desc: 'Customers submit support requests in seconds — no account needed. Just fill the form and go.',
  },
  {
    icon: '📍',
    title: 'Real-Time Tracking',
    desc: 'Customers track their ticket status live using a unique ID. Full transparency, zero guessing.',
  },
  {
    icon: '👥',
    title: 'Team Management',
    desc: 'Admins assign tickets to agents, monitor workloads, and track resolution performance.',
  },
  {
    icon: '📊',
    title: 'Powerful Dashboard',
    desc: 'Beautiful analytics showing open tickets, resolution rates, agent performance and more.',
  },
  {
    icon: '🔒',
    title: 'Secure & Reliable',
    desc: 'JWT-based authentication, role-based access control, and data you can trust.',
  },
  {
    icon: '🇬🇭',
    title: 'Built for Ghana',
    desc: 'Designed with Ghanaian SMEs, schools, and organizations in mind. Local context, global quality.',
  },
]

// ── How it works ──
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Submit a Ticket',
    desc: 'Customer fills a simple form with their issue. No account required.',
  },
  {
    step: '02',
    title: 'Team Gets Notified',
    desc: 'Your support agents see the ticket instantly on their dashboard.',
  },
  {
    step: '03',
    title: 'Issue Gets Resolved',
    desc: 'Agent updates the ticket, customer tracks progress with their ticket ID.',
  },
]

export default function Landing() {
  return (
    <div className="landing page-enter">

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="landing__hero">
        <div className="container">
          <div className="landing__hero-inner">

            {/* Left — Text */}
            <div className="landing__hero-text">

              <div className="landing__hero-pill">
                🇬🇭 Built for Ghanaian Businesses
              </div>

              <h1 className="landing__hero-title">
                Support your customers
                <span className="landing__hero-highlight"> like a pro</span>
              </h1>

              <p className="landing__hero-desc">
                GhanaDesk is a simple, powerful helpdesk system for Ghanaian
                SMEs, schools, and organizations. Manage customer tickets,
                track issues, and deliver excellent support — all in one place.
              </p>

              <div className="landing__hero-actions">
                <Link to="/submit-ticket">
                  <Button variant="primary" size="lg">
                    Submit a Ticket
                  </Button>
                </Link>
                <Link to="/track-ticket">
                  <Button variant="secondary" size="lg">
                    Track My Ticket
                  </Button>
                </Link>
              </div>

              {/* Trust line */}
              <p className="landing__hero-trust">
                ✓ Free to use &nbsp;·&nbsp; ✓ No account needed &nbsp;·&nbsp; ✓ Instant support
              </p>

            </div>

            {/* Right — Visual Card */}
            <div className="landing__hero-visual">
              <div className="landing__hero-card">

                {/* Card Header */}
                <div className="landing__hero-card-header">
                  <div className="landing__hero-card-dots">
                    <span style={{ background: '#EF4444' }} />
                    <span style={{ background: '#F59E0B' }} />
                    <span style={{ background: '#10B981' }} />
                  </div>
                  <span className="landing__hero-card-title">GhanaDesk Portal</span>
                </div>

                {/* Fake Ticket Items */}
                {[
                  { id: 'GHD-001', title: 'Internet not working in office',   status: 'open',        time: '2m ago'  },
                  { id: 'GHD-002', title: 'Cannot access student portal',      status: 'in_progress', time: '1hr ago' },
                  { id: 'GHD-003', title: 'Payment not reflecting on account', status: 'resolved',    time: '3hr ago' },
                  { id: 'GHD-004', title: 'Printer offline on 2nd floor',      status: 'open',        time: '5hr ago' },
                ].map((t) => (
                  <div key={t.id} className="landing__fake-ticket">
                    <div className="landing__fake-ticket-left">
                      <span className="landing__fake-ticket-id">#{t.id}</span>
                      <span className="landing__fake-ticket-title">{t.title}</span>
                    </div>
                    <div className="landing__fake-ticket-right">
                      <span className={`badge badge--${t.status}`}>
                        {t.status === 'in_progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                      <span className="landing__fake-ticket-time">{t.time}</span>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section className="landing__stats">
        <div className="container">
          <div className="landing__stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="landing__stat-item">
                <span className="landing__stat-value">{stat.value}</span>
                <span className="landing__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className="landing__features">
        <div className="container">

          <div className="landing__section-header">
            <p className="landing__section-pill">Features</p>
            <h2 className="landing__section-title">
              Everything your support team needs
            </h2>
            <p className="landing__section-desc">
              From ticket submission to resolution — GhanaDesk covers the full
              support lifecycle for your organization.
            </p>
          </div>

          <div className="landing__features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="landing__feature-card">
                <div className="landing__feature-icon">{f.icon}</div>
                <h3 className="landing__feature-title">{f.title}</h3>
                <p className="landing__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="landing__how">
        <div className="container">

          <div className="landing__section-header">
            <p className="landing__section-pill">How It Works</p>
            <h2 className="landing__section-title">Simple. Fast. Effective.</h2>
            <p className="landing__section-desc">
              Three steps from problem to resolution.
            </p>
          </div>

          <div className="landing__how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="landing__how-card">
                <div className="landing__how-step">{step.step}</div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="landing__how-connector" />
                )}
                <h3 className="landing__how-title">{step.title}</h3>
                <p className="landing__how-desc">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="landing__cta">
        <div className="container">
          <div className="landing__cta-inner">
            <div className="landing__cta-text">
              <h2 className="landing__cta-title">
                Ready to upgrade your customer support?
              </h2>
              <p className="landing__cta-desc">
                Start submitting and tracking tickets today — completely free.
              </p>
            </div>
            <div className="landing__cta-actions">
              <Link to="/submit-ticket">
                <Button variant="accent" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/track-ticket">
                <Button variant="ghost" size="lg"
                  style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Track a Ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}