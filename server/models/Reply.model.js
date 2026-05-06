// server/models/Reply.model.js
// ─────────────────────────────────────────
// Replies are embedded in Ticket model.
// This file is kept for potential future
// standalone reply features (e.g. email logs)
// ─────────────────────────────────────────

// Replies are stored as subdocuments
// inside Ticket.replies[] — see Ticket.model.js
// No separate collection needed for now.

module.exports = {}