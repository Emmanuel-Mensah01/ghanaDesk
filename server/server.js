// server/server.js
// ─────────────────────────────────────────
// Entry point — Express app setup,
// middleware, routes, error handler
// ─────────────────────────────────────────

require('express-async-errors')
const express       = require('express')
const cors          = require('cors')
const helmet        = require('helmet')
const morgan        = require('morgan')
const cookieParser  = require('cookie-parser')
const dotenv        = require('dotenv')

dotenv.config()

const connectDB       = require('./config/db')
const errorMiddleware = require('./middleware/error.middleware')

// ── Route imports ──
const authRoutes   = require('./routes/auth.routes')
const ticketRoutes = require('./routes/ticket.routes')
const agentRoutes  = require('./routes/agent.routes')
const statsRoutes  = require('./routes/stats.routes')

// ── Connect Database ──
connectDB()

const app = express()

// ── Core Middleware ──
app.use(helmet())
app.use(cors({
  origin: "https://ghana-desk.vercel.app"
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Health Check ──
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'GhanaDesk API is running 🇬🇭',
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  })
})

// ── API Routes ──
app.use('/api/v1/auth',    authRoutes)
app.use('/api/v1/tickets', ticketRoutes)
app.use('/api/v1/agents',  agentRoutes)
app.use('/api/v1/stats',   statsRoutes)

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// ── Global Error Handler ──
app.use(errorMiddleware)

// ── Start Server ──
const PORT = process.env.PORT || 5000

const { seedAdmin } = require('./controllers/auth.controller')

app.listen(PORT, async () => {
  await seedAdmin()
  console.log(`
  ┌─────────────────────────────────────┐
  │   GhanaDesk API                     │
  │   Running on http://localhost:${PORT}   │
  │   ENV: ${process.env.NODE_ENV}               │
  └─────────────────────────────────────┘
  `)
})