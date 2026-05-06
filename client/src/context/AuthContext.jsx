// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true) // starts TRUE

  // ── Restore session on app load ──
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('gd_token')
      const savedUser  = localStorage.getItem('gd_user')

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch {
      localStorage.removeItem('gd_token')
      localStorage.removeItem('gd_user')
    } finally {
      setLoading(false) // ALWAYS set false when done
    }
  }, [])

  const login = useCallback((userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('gd_token', authToken)
    localStorage.setItem('gd_user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('gd_token')
    localStorage.removeItem('gd_user')
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin:         user?.role === 'admin',
    isStaff:         user?.role === 'staff' || user?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}