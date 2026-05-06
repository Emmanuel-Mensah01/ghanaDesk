// server/middleware/auth.middleware.js
// ─────────────────────────────────────────
// Verify JWT on protected routes
// Attaches req.user on success
// ─────────────────────────────────────────

const jwt  = require('jsonwebtoken')
const User = require('../models/User.model')

const protect = async (req, res, next) => {
  let token

  // ── Check Authorization header ──
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in.',
    })
  }

  try {
    // ── Verify token ──
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ── Attach user to request ──
    req.user = await User.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      })
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      })
    }

    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    })
  }
}

module.exports = { protect }