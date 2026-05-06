// src/hooks/useAuth.js
// ─────────────────────────────────────────
// Clean hook — any component that needs
// auth just calls useAuth() instead of
// importing AuthContext directly
// ─────────────────────────────────────────

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }

  return context
}