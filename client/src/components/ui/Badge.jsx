// src/components/ui/Badge.jsx
// ─────────────────────────────────────────
// Status badge — maps ticket status
// to the correct color class
// ─────────────────────────────────────────

// Maps any status string to badge class
const STATUS_MAP = {
  open:        'open',
  in_progress: 'in_progress',
  progress:    'progress',
  resolved:    'resolved',
  closed:      'closed',
  info:        'info',
  success:     'success',
}

export default function Badge({ status, label, className = '' }) {

  const key       = status?.toLowerCase().replace(' ', '_')
  const modifier  = STATUS_MAP[key] || 'info'
  const display   = label || status || ''

  return (
    <span className={`badge badge--${modifier} ${className}`}>
      {display}
    </span>
  )
}