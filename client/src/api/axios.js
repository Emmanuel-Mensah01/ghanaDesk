// src/api/axios.js
// ─────────────────────────────────────────
// Axios instance — automatically attaches
// JWT token to every request
// ─────────────────────────────────────────

import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Attach token to every request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gd_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Handle 401 globally — logout if token expired ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gd_token')
      localStorage.removeItem('gd_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api