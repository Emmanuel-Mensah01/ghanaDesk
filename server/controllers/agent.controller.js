// server/controllers/agent.controller.js
// ─────────────────────────────────────────
// Admin manages staff agents —
// create, list, toggle active status
// ─────────────────────────────────────────

const User         = require('../models/User.model')
const sendResponse = require('../utils/sendResponse')

// ── @GET /api/v1/agents — Admin ──
const getAgents = async (req, res) => {
  const { limit = 50 } = req.query

  const agents = await User.find({ role: 'staff' })
    .sort({ createdAt: -1 })
    .limit(Number(limit))

  sendResponse(res, 200, 'Agents fetched', agents)
}

// ── @POST /api/v1/agents — Admin ──
const createAgent = async (req, res) => {
  const { name, email, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) return sendResponse(res, 400, 'Email already in use')

  const agent = await User.create({
    name,
    email,
    password,
    role: 'staff',
  })

  // Return without password
  const safe = await User.findById(agent._id)
  sendResponse(res, 201, 'Agent created successfully', safe)
}

// ── @PATCH /api/v1/agents/:id/toggle — Admin ──
const toggleAgentStatus = async (req, res) => {
  const agent = await User.findById(req.params.id)

  if (!agent || agent.role !== 'staff') {
    return sendResponse(res, 404, 'Agent not found')
  }

  agent.isActive = !agent.isActive
  await agent.save()

  sendResponse(
    res,
    200,
    `Agent ${agent.isActive ? 'activated' : 'deactivated'}`,
    agent
  )
}

module.exports = { getAgents, createAgent, toggleAgentStatus }