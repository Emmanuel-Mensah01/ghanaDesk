// src/components/ui/Card.jsx
// ─────────────────────────────────────────
// Reusable card container
// Optional header with title + action slot
// ─────────────────────────────────────────

export default function Card({
  children,
  title,
  subtitle,
  action,
  flat      = false,
  className = '',
}) {

  const classes = [
    'card',
    flat ? 'card--flat' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>

      {/* Card Header — only renders if title is passed */}
      {title && (
        <div className="card__header">
          <div>
            <p className="card__title">{title}</p>
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Card Body */}
      {children}

    </div>
  )
}