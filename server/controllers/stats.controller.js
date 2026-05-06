// server/controllers/stats.controller.js
// ─────────────────────────────────────────
// Dashboard stats for staff and admin
// ─────────────────────────────────────────

const Ticket       = require('../models/Ticket.model')
const User         = require('../models/User.model')
const sendResponse = require('../utils/sendResponse')

// ── @GET /api/v1/stats/staff — Staff ──
const getStaffStats = async (req, res) => {
  const agentId = req.user._id

  // Start of today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [assigned, open, inProgress, resolvedToday] = await Promise.all([
    Ticket.countDocuments({ assignedTo: agentId }),
    Ticket.countDocuments({ assignedTo: agentId, status: 'open' }),
    Ticket.countDocuments({ assignedTo: agentId, status: 'in_progress' }),
    Ticket.countDocuments({
      assignedTo: agentId,
      status:     'resolved',
      updatedAt:  { $gte: todayStart },
    }),
  ])

  sendResponse(res, 200, 'Staff stats fetched', {
    assigned,
    open,
    inProgress,
    resolvedToday,
  })
}

// ── @GET /api/v1/stats/admin — Admin ──
const getAdminStats = async (req, res) => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [total, open, inProgress, resolved, closed, agentCount] =
    await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Ticket.countDocuments({ status: 'in_progress' }),
      Ticket.countDocuments({ status: 'resolved' }),
      Ticket.countDocuments({ status: 'closed' }),
      User.countDocuments({ role: 'staff', isActive: true }),
    ])

  sendResponse(res, 200, 'Admin stats fetched', {
    total,
    open,
    inProgress,
    resolved,
    closed,
    agents:      agentCount,
    avgResponse: '1.8 hrs', // placeholder — can make dynamic later
  })
}

module.exports = { getStaffStats, getAdminStats }