// src/components/ui/Button.jsx
// ─────────────────────────────────────────
// Reusable button — variants, sizes,
// loading state, icon support
// ─────────────────────────────────────────

export default function Button({
  children,
  variant  = 'primary',   // primary | secondary | danger | ghost | accent
  size     = 'md',        // sm | md | lg
  full     = false,
  loading  = false,
  disabled = false,
  type     = 'button',
  onClick,
  className = '',
}) {

  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    full    ? 'btn--full'    : '',
    loading ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
    </button>
  )
}