// src/components/ui/Input.jsx
// ─────────────────────────────────────────
// Reusable form input — text, email,
// password, textarea, select
// Supports label, error, hint, icon
// ─────────────────────────────────────────

export default function Input({
  label,
  name,
  type        = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  hint,
  icon,
  required    = false,
  disabled    = false,
  rows        = 4,
  options     = [],      // for type="select"
  className   = '',
}) {

  const inputClass = [
    'form-input',
    icon  ? 'form-input--with-icon' : '',
    error ? 'form-input--error'     : '',
    className,
  ].filter(Boolean).join(' ')

  const renderField = () => {

    // ── Textarea ──
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          id={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClass}
        />
      )
    }

    // ── Select ──
    if (type === 'select') {
      return (
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClass}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    // ── Regular Input ──
    return (
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClass}
      />
    )
  }

  return (
    <div className="form-group">

      {/* Label */}
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span>*</span>}
        </label>
      )}

      {/* Input with optional icon */}
      {icon ? (
        <div className="form-input-wrapper">
          <span className="form-input-icon">{icon}</span>
          {renderField()}
        </div>
      ) : (
        renderField()
      )}

      {/* Error message */}
      {error && <p className="form-error">{error}</p>}

      {/* Hint text */}
      {hint && !error && <p className="form-hint">{hint}</p>}

    </div>
  )
}