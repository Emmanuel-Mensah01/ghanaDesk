// src/main.jsx
// ─────────────────────────────────────────
// Entry point — imports all global styles
// and mounts the React app to the DOM
// ─────────────────────────────────────────

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ── Global Styles (order matters) ──
import './styles/variables.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)