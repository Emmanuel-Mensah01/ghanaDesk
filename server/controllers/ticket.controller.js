// server/controllers/ticket.controller.js
// ─────────────────────────────────────────
// Public: submit, track
// Staff: my tickets, detail, reply, status
// Admin: all tickets, assign
// ─────────────────────────────────────────

const Ticket       = require('../models/Ticket.model')
const User         = require('../models/User.model')
const sendResponse = require('../utils/sendResponse')

// ── @POST /api/v1/tickets — Public ──
const submitTicket = async (req, res) => {
  const {
    customerName, customerEmail, customerPhone,
    title, description, category, priority,
  } = req.body

  const ticket = await Ticket.create({
    customerName,
    customerEmail,
    customerPhone,
    title,
    description,
    category,
    priority: priority || 'medium',
  })

  sendResponse(res, 201, 'Ticket submitted successfully', ticket)
}

// ── @GET /api/v1/tickets/track/:ticketId — Public ──
const trackTicket = async (req, res) => {
  const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
    .populate('assignedTo', 'name email')
    .populate('replies.author', 'name')

  if (!ticket) {
    return sendResponse(res, 404, 'Ticket not found. Check your Ticket ID and try again.')
  }

  sendResponse(res, 200, 'Ticket found', ticket)
}

// ── @GET /api/v1/tickets/my — Staff (own tickets) ──
const getMyTickets = async (req, res) => {
  const { status, limit = 50 } = req.query

  const filter = { assignedTo: req.user._id }
  if (status) filter.status = status

  const tickets = await Ticket.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('assignedTo', 'name email')

  sendResponse(res, 200, 'Tickets fetched', tickets)
}

// ── @GET /api/v1/tickets — Admin (all tickets) ──
const getAllTickets = async (req, res) => {
  const { status, priority, limit = 100 } = req.query

  const filter = {}
  if (status)   filter.status   = status
  if (priority) filter.priority = priority

  const tickets = await Ticket.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('assignedTo', 'name email')

  sendResponse(res, 200, 'All tickets fetched', tickets)
}

// ── @GET /api/v1/tickets/:id — Staff + Admin ──
const getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('replies.author', 'name email')

  if (!ticket) return sendResponse(res, 404, 'Ticket not found')

  sendResponse(res, 200, 'Ticket fetched', ticket)
}

// ── @PATCH /api/v1/tickets/:id/status — Staff + Admin ──
const updateStatus = async (req, res) => {
  const { status } = req.body

  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'name email')

  if (!ticket) return sendResponse(res, 404, 'Ticket not found')

  // ── Update agent counters ──
  if (ticket.assignedTo) {
    if (status === 'resolved' || status === 'closed') {
      await User.findByIdAndUpdate(ticket.assignedTo._id, {
        $inc: { resolvedCount: 1 },
      })
    }
  }

  sendResponse(res, 200, 'Status updated', ticket)
}

// ── @POST /api/v1/tickets/:id/reply — Staff + Admin ──
const addReply = async (req, res) => {
  const { message } = req.body

  if (!message?.trim()) {
    return sendResponse(res, 400, 'Reply message cannot be empty')
  }

  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) return sendResponse(res, 404, 'Ticket not found')

  ticket.replies.push({
    message,
    author:    req.user._id,
    createdAt: new Date(),
  })

  await ticket.save()

  const updated = await Ticket.findById(ticket._id)
    .populate('assignedTo', 'name email')
    .populate('replies.author', 'name email')

  sendResponse(res, 200, 'Reply added', updated)
}

// ── @PATCH /api/v1/tickets/:id/assign — Admin only ──
const assignTicket = async (req, res) => {
  const { agentId } = req.body

  const agent = await User.findById(agentId)
  if (!agent || agent.role !== 'staff') {
    return sendResponse(res, 400, 'Invalid agent selected')
  }

  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { assignedTo: agentId, status: 'in_progress' },
    { new: true }
  ).populate('assignedTo', 'name email')

  if (!ticket) return sendResponse(res, 404, 'Ticket not found')

  // Update agent open count
  await User.findByIdAndUpdate(agentId, { $inc: { openCount: 1 } })

  sendResponse(res, 200, 'Ticket assigned', ticket)
}

module.exports = {
  submitTicket,
  trackTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateStatus,
  addReply,
  assignTicket,
}