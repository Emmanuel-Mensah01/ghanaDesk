// server/routes/agent.routes.js

const express = require('express')
const router  = express.Router()

const {
  getAgents, createAgent, toggleAgentStatus,
} = require('../controllers/agent.controller')

const { protect }    = require('../middleware/auth.middleware')
const { restrictTo } = require('../middleware/role.middleware')

// All agent routes — admin only
router.use(protect, restrictTo('admin'))

router.get ('/',              getAgents)
router.post('/',              createAgent)
router.patch('/:id/toggle',  toggleAgentStatus)

module.exports = router