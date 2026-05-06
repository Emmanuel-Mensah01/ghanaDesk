// ─────────────────────────────────────────
// GhanaDesk Server Entry Point
// ─────────────────────────────────────────

require("express-async-errors")
require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

// ── App Init ──
const app = express()

// ── Database ──
const connectDB = require("./config/db")
connectDB()

// ── Middleware ──

// Security headers
app.use(helmet())

// CORS (CRITICAL for Vercel + Render)
app.use(
  cors({
    origin: "https://ghana-desk.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
  })
)

// Handle preflight requests
app.options("*", cors())

// Logging
app.use(morgan("dev"))

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookies
app.use(cookieParser())

// ── Routes ──
const authRoutes = require("./routes/auth.routes")
const ticketRoutes = require("./routes/ticket.routes")
const agentRoutes = require("./routes/agent.routes")
const statsRoutes = require("./routes/stats.routes")

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/tickets", ticketRoutes)
app.use("/api/v1/agents", agentRoutes)
app.use("/api/v1/stats", statsRoutes)

// ── Health Check ──
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "GhanaDesk API running 🇬🇭",
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  })
})

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// ── Global Error Handler ──
const errorMiddleware = require("./middleware/error.middleware")
app.use(errorMiddleware)

// ── Seed + Start Server ──
const PORT = process.env.PORT || 5000
const { seedAdmin } = require("./controllers/auth.controller")

app.listen(PORT, async () => {
  try {
    await seedAdmin()
  } catch (err) {
    console.error("Seed admin error:", err.message)
  }

  console.log(`
┌──────────────────────────────┐
│     GhanaDesk API            │
│     Running on port ${PORT}      │
│     ENV: ${process.env.NODE_ENV}      │
└──────────────────────────────┘
  `)
})