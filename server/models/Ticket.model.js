// server/models/Ticket.model.js
// ─────────────────────────────────────────
// Support ticket — submitted by customers
// Tracked by staff and admin
// ─────────────────────────────────────────

const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema(
  {
    // ── Auto-generated readable ID ──
    ticketId: {
      type:   String,
      unique: true,
    },

    // ── Customer Info (no account needed) ──
    customerName: {
      type:     String,
      required: [true, 'Customer name is required'],
      trim:     true,
    },

    customerEmail: {
      type:     String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim:     true,
    },

    customerPhone: {
      type:    String,
      default: '',
    },

    // ── Ticket Content ──
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },

    description: {
      type:     String,
      required: [true, 'Description is required'],
    },

    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum: [
        'technical', 'billing', 'account',
        'network', 'hardware', 'software',
        'general', 'other',
      ],
    },

    priority: {
      type:    String,
      enum:    ['low', 'medium', 'high'],
      default: 'medium',
    },

    status: {
      type:    String,
      enum:    ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },

    // ── Assignment ──
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      default: null,
    },

    // ── Replies thread ──
    replies: [
      {
        message: {
          type:     String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref:  'User',
        },
        createdAt: {
          type:    Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)
TicketSchema.pre('save', async function () {
  if (this.ticketId) return

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const random = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')

  this.ticketId = `GHD-${random}`
})

module.exports = mongoose.model('Ticket', TicketSchema)