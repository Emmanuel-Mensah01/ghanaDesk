// src/components/ui/Modal.jsx
// ─────────────────────────────────────────
// Accessible modal — backdrop click closes,
// supports title, body, footer actions
// ─────────────────────────────────────────

import { useEffect } from 'react'
import Button from './Button'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {

  // ── Close on Escape key ──
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalStyle = {
    maxWidth: size === 'lg' ? '720px' : size === 'sm' ? '380px' : '520px',
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}              // click backdrop to close
    >
      <div
        className="modal"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()} // prevent close on modal click
      >

        {/* Header */}
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}

      </div>
    </div>
  )
}