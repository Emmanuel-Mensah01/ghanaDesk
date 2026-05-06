// src/components/shared/StatusBadge.jsx
// ─────────────────────────────────────────
// Standalone status badge component —
// wraps Badge with ticket-specific logic
// ─────────────────────────────────────────

import Badge from '../ui/Badge'

// Human-readable labels per status
const STATUS_LABELS = {
  open:        'Open',
  in_progress: 'In Progress',
  resolved:    'Resolved',
  closed:      'Closed',
}

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status

  return <Badge status={status} label={label} />
}