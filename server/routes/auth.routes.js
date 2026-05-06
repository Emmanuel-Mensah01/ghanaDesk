// server/routes/auth.routes.js

const express = require('express')
const router  = express.Router()

const {
  login, updateProfile, changePassword, getMe,
} = require('../controllers/auth.controller')

const { protect } = require('../middleware/auth.middleware')

router.post('/login',           login)
router.get ('/me',              protect, getMe)
router.patch('/profile',        protect, updateProfile)
router.patch('/change-password', protect, changePassword)

module.exports = router