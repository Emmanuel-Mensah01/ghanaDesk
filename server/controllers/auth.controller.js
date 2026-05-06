// server/controllers/auth.controller.js
// ─────────────────────────────────────────
// Login, profile update, password change
// Admin seeding on first run
// ─────────────────────────────────────────

const User          = require('../models/User.model')
const generateToken = require('../utils/generateToken')
const sendResponse  = require('../utils/sendResponse')

// ── @POST /api/v1/auth/login ──
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return sendResponse(res, 400, 'Please provide email and password')
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    return sendResponse(res, 401, 'Invalid email or password')
  }

  if (!user.isActive) {
    return sendResponse(res, 403, 'Your account has been deactivated. Contact admin.')
  }

  const token = generateToken(user._id)

  sendResponse(res, 200, 'Login successful', {
    token,
    user: {
      _id:     user._id,
      name:    user.name,
      email:   user.email,
      role:    user.role,
      company: user.company,
    },
  })
}

// ── @PATCH /api/v1/auth/profile ──
const updateProfile = async (req, res) => {
  const { name, email, company } = req.body

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, company },
    { new: true, runValidators: true }
  )

  sendResponse(res, 200, 'Profile updated', updated)
}

// ── @PATCH /api/v1/auth/change-password ──
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(req.user._id).select('+password')

  if (!(await user.matchPassword(currentPassword))) {
    return sendResponse(res, 401, 'Current password is incorrect')
  }

  user.password = newPassword
  await user.save()

  sendResponse(res, 200, 'Password updated successfully')
}

// ── @GET /api/v1/auth/me ──
const getMe = async (req, res) => {
  sendResponse(res, 200, 'User fetched', req.user)
}

// ── Seed admin on first run ──
const seedAdmin = async () => {
  const exists = await User.findOne({ role: 'admin' })
  if (exists) return

  await User.create({
    name:     'GhanaDesk Admin',
    email:    'admin@ghanaDesk.com',
    password: 'Admin@1234',
    role:     'admin',
    company:  'GhanaDesk',
  })

  // Seed a demo staff account too
  await User.create({
    name:     'Demo Staff',
    email:    'staff@ghanaDesk.com',
    password: 'Staff@1234',
    role:     'staff',
  })

  console.log('✅ Demo accounts seeded: admin@ghanaDesk.com / staff@ghanaDesk.com')
}

module.exports = { login, updateProfile, changePassword, getMe, seedAdmin }