// src/components/shared/StatsCard.jsx
// ─────────────────────────────────────────
// Dashboard stats card — icon, value,
// label, trend indicator
// ─────────────────────────────────────────

export default function StatsCard({
  label,
  value,
  icon,
  trend,        // e.g. '+12%'
  trendUp,      // true = green, false = red
  iconBg,       // background color for icon box
  iconColor,    // icon color
}) {

  return (
    <div className="stats-card">

      {/* Top Row — label + icon */}
      <div className="stats-card__top">
        <div>
          <p className="stats-card__label">{label}</p>
          <p className="stats-card__value">{value ?? '—'}</p>
        </div>

        {icon && (
          <div
            className="stats-card__icon"
            style={{
              background: iconBg    || 'var(--primary-light)',
              color:      iconColor || 'var(--primary)',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={`stats-card__trend stats-card__trend--${trendUp ? 'up' : 'down'}`}>
          <span>{trendUp ? '▲' : '▼'}</span>
          <span>{trend}</span>
          <span style={{ fontWeight: 'var(--weight-normal)', color: 'var(--gray-400)' }}>
            vs last month
          </span>
        </div>
      )}

    </div>
  )
}