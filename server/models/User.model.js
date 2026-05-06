// server/models/User.model.js
// ─────────────────────────────────────────
// Staff + Admin users
// Roles: admin | staff
// ─────────────────────────────────────────

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: 8,
      select:    false, // never return password in queries
    },

    role: {
      type:    String,
      enum:    ['admin', 'staff'],
      default: 'staff',
    },

    company: {
      type:    String,
      default: 'GhanaDesk',
    },

    isActive: {
      type:    Boolean,
      default: true,
    },

    // ticket performance counters
    resolvedCount: { type: Number, default: 0 },
    openCount:     { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

// ── Compare password method ──
UserSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model('User', UserSchema)