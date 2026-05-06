# GhanaDesk 🇬🇭

> A modern helpdesk and ticket management system built for Ghanaian businesses, schools, and organizations.

## Overview

GhanaDesk is a full-stack SaaS-style support ticketing platform. Customers submit tickets without an account, track status in real time, and receive updates from support agents.

Built under **EM Control IT Solutions** by Emmanuel Mensah.

## Features

- Submit support tickets — no account needed
- Unique Ticket ID per submission (GHD-XXXXXX)
- Real-time ticket tracking with status timeline
- Staff portal — manage assigned tickets, reply to customers
- Admin portal — full stats, all tickets, agent management
- Role-based access control (Admin / Staff)
- JWT authentication

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React (Vite), React Router, Axios |
| Styling  | Plain CSS, CSS Custom Properties  |
| Backend  | Node.js, Express.js               |
| Database | MongoDB with Mongoose             |
| Auth     | JWT, bcryptjs                     |

## Getting Started

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Demo Accounts

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@ghanaDesk.com | Admin@1234 |
| Staff | staff@ghanaDesk.com | Staff@1234 |

## Author

**Emmanuel Mensah** — EM Control IT Solutions — Accra, Ghana

> Building real SaaS products for the Ghanaian market.
