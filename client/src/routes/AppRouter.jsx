// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout    from '../components/layout/PublicLayout'
import DashboardLayout from '../components/layout/DashboardLayout'

// Guards
import ProtectedRoute from './ProtectedRoute'
import RoleRoute      from './RoleRoute'

// Public Pages
import Landing      from '../pages/public/Landing'
import SubmitTicket from '../pages/public/SubmitTicket'
import TrackTicket  from '../pages/public/TrackTicket'

// Auth
import Login from '../pages/auth/Login'

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard'
import MyTickets      from '../pages/staff/MyTickets'
import TicketDetail   from '../pages/staff/TicketDetail'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import AllTickets     from '../pages/admin/AllTickets'
import Agents         from '../pages/admin/Agents'
import Settings       from '../pages/admin/Settings'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"              element={<Landing />} />
          <Route path="/submit-ticket" element={<SubmitTicket />} />
          <Route path="/track-ticket"  element={<TrackTicket />} />
          <Route path="/login"         element={<Login />} />
        </Route>

        {/* ── Protected: Staff ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RoleRoute allowedRoles={['staff', 'admin']} />}>
              <Route path="/staff"             element={<StaffDashboard />} />
              <Route path="/staff/tickets"     element={<MyTickets />} />
              <Route path="/staff/tickets/:id" element={<TicketDetail />} />
            </Route>
          </Route>
        </Route>

        {/* ── Protected: Admin ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin"                 element={<AdminDashboard />} />
              <Route path="/admin/tickets"         element={<AllTickets />} />
              <Route path="/admin/tickets/:id"     element={<TicketDetail />} />
              <Route path="/admin/agents"          element={<Agents />} />
              <Route path="/admin/settings"        element={<Settings />} />
            </Route>
          </Route>
        </Route>

        {/* ── Fallbacks ── */}
        <Route path="/unauthorized" element={
          <div className="spinner-page">
            <h2>⛔ Access Denied</h2>
            <p>You don't have permission to view this page.</p>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}