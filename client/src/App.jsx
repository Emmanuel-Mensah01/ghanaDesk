// src/App.jsx
// ─────────────────────────────────────────
// Root component — wraps everything in
// AuthContext and hands off to the Router
// ─────────────────────────────────────────

import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}