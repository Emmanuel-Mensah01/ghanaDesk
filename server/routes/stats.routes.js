// server/routes/stats.routes.js

const express = require('express')
const router  = express.Router()

const {
  getStaffStats, getAdminStats,
} = require('../controllers/stats.controller')

const { protect }    = require('../middleware/auth.middleware')
const { restrictTo } = require('../middleware/role.middleware')

router.get('/staff', protect, getStaffStats)
router.get('/admin', protect, restrictTo('admin'), getAdminStats)

module.exports = router