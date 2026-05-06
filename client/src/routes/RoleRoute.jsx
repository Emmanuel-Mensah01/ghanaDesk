// src/routes/RoleRoute.jsx
// ─────────────────────────────────────────
// Guards routes by role.
// Pass allowedRoles={['admin']} as a prop
// ─────────────────────────────────────────

import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const hasRole = allowedRoles.includes(user?.role)

  return hasRole ? <Outlet /> : <Navigate to="/unauthorized" replace />
}