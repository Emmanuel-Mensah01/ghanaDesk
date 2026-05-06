// server/routes/ticket.routes.js

const express = require('express')
const router  = express.Router()

const {
  submitTicket, trackTicket, getMyTickets,
  getAllTickets, getTicketById, updateStatus,
  addReply, assignTicket,
} = require('../controllers/ticket.controller')

const { protect }     = require('../middleware/auth.middleware')
const { restrictTo }  = require('../middleware/role.middleware')

// ── Public ──
router.post('/',                submitTicket)
router.get ('/track/:ticketId', trackTicket)

// ── Staff + Admin ──
router.get('/my',       protect, getMyTickets)
router.get('/',         protect, restrictTo('admin'), getAllTickets)
router.get('/:id',      protect, getTicketById)
router.patch('/:id/status', protect, updateStatus)
router.post('/:id/reply',   protect, addReply)

// ── Admin only ──
router.patch('/:id/assign', protect, restrictTo('admin'), assignTicket)

module.exports = router