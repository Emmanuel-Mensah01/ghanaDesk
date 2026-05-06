// src/components/ui/Spinner.jsx
// ─────────────────────────────────────────
// Animated loading spinner
// size: sm | md | lg
// color: default (blue) | white
// ─────────────────────────────────────────

export default function Spinner({
  size  = 'md',
  white = false,
  page  = false,
  label = 'Loading...',
}) {

  const classes = [
    'spinner',
    size !== 'md' ? `spinner--${size}` : '',
    white ? 'spinner--white' : '',
  ].filter(Boolean).join(' ')

  // Full page centered spinner
  if (page) {
    return (
      <div className="spinner-page">
        <div className={classes} />
        {label && <p>{label}</p>}
      </div>
    )
  }

  return <div className={classes} />
}