// server/middleware/role.middleware.js
// ─────────────────────────────────────────
// Restrict routes to specific roles
// Always use AFTER protect middleware
// ─────────────────────────────────────────

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} cannot perform this action.`,
      })
    }
    next()
  }
}

module.exports = { restrictTo }