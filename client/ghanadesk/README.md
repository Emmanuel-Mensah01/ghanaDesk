## `README.md` — Root of `ghanaDesk/`

```markdown
# GhanaDesk 🇬🇭

> A modern helpdesk and ticket management system built for Ghanaian
> businesses, schools, and organizations.

![GhanaDesk](./client/public/favicon.svg)

---

## 🌍 Overview

GhanaDesk is a full-stack SaaS-style support ticketing platform that allows
organizations to manage customer support requests efficiently. Customers can
submit tickets without an account, track their status in real time, and
receive updates from support agents — all through a clean, fast, and
mobile-friendly interface.

Built as a portfolio project under **EM Control IT Solutions** to demonstrate
real-world full-stack development with the MERN stack.

---

## ✨ Features

### Public (No Account Needed)
- Submit a support ticket with category and priority
- Receive a unique Ticket ID (e.g. `GHD-A1B2C3`)
- Track ticket status and view agent replies in real time

### Staff Portal
- Secure JWT login
- View all assigned tickets
- Filter by status — Open, In Progress, Resolved, Closed
- Reply to customers through a conversation thread
- Update ticket status with one click

### Admin Portal
- Full dashboard with live stats
- View and manage ALL tickets across the organization
- Create and manage support agents
- Monitor agent performance (tickets resolved, open load)
- Update profile and change password via settings

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React (Vite), React Router, Axios   |
| Styling    | Plain CSS with CSS custom properties|
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB with Mongoose               |
| Auth       | JWT (JSON Web Tokens)               |
| Security   | bcryptjs, helmet, cors              |

---

## 📁 Project Structure

```
ghanaDesk/
├── client/                  ← React Frontend (Vite)
│   └── src/
│       ├── api/             ← Axios instance
│       ├── components/      ← UI, Layout, Shared components
│       ├── context/         ← Auth context
│       ├── hooks/           ← Custom React hooks
│       ├── pages/           ← Public, Auth, Staff, Admin pages
│       ├── routes/          ← App router + guards
│       ├── styles/          ← Global CSS + design tokens
│       └── utils/           ← Helper functions
│
└── server/                  ← Node/Express Backend
    ├── config/              ← MongoDB connection
    ├── controllers/         ← Route logic
    ├── middleware/          ← Auth, role, error handlers
    ├── models/              ← Mongoose schemas
    ├── routes/              ← API route definitions
    └── utils/               ← Token, response helpers
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ghanaDesk.git
cd ghanaDesk
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Create your `.env` file inside `server/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ghanaDesk
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`

On first start, two demo accounts are automatically seeded:

| Role  | Email                  | Password     |
|-------|------------------------|--------------|
| Admin | admin@ghanaDesk.com    | Admin@1234   |
| Staff | staff@ghanaDesk.com    | Staff@1234   |

---

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

The app will run at `http://localhost:5173`

> The Vite dev server proxies all `/api` requests to the backend
> automatically — no CORS configuration needed during development.

---

## 🔌 API Reference

### Auth
| Method | Endpoint                      | Access  | Description          |
|--------|-------------------------------|---------|----------------------|
| POST   | `/api/v1/auth/login`          | Public  | Staff / Admin login  |
| GET    | `/api/v1/auth/me`             | Private | Get current user     |
| PATCH  | `/api/v1/auth/profile`        | Private | Update profile       |
| PATCH  | `/api/v1/auth/change-password`| Private | Change password      |

### Tickets
| Method | Endpoint                        | Access       | Description           |
|--------|---------------------------------|--------------|-----------------------|
| POST   | `/api/v1/tickets`               | Public       | Submit a ticket       |
| GET    | `/api/v1/tickets/track/:id`     | Public       | Track by ticket ID    |
| GET    | `/api/v1/tickets/my`            | Staff+Admin  | My assigned tickets   |
| GET    | `/api/v1/tickets`               | Admin only   | All tickets           |
| GET    | `/api/v1/tickets/:id`           | Staff+Admin  | Single ticket detail  |
| PATCH  | `/api/v1/tickets/:id/status`    | Staff+Admin  | Update ticket status  |
| POST   | `/api/v1/tickets/:id/reply`     | Staff+Admin  | Add reply to ticket   |
| PATCH  | `/api/v1/tickets/:id/assign`    | Admin only   | Assign to agent       |

### Agents
| Method | Endpoint                      | Access     | Description           |
|--------|-------------------------------|------------|-----------------------|
| GET    | `/api/v1/agents`              | Admin only | List all agents       |
| POST   | `/api/v1/agents`              | Admin only | Create new agent      |
| PATCH  | `/api/v1/agents/:id/toggle`   | Admin only | Activate / Deactivate |

### Stats
| Method | Endpoint               | Access     | Description        |
|--------|------------------------|------------|--------------------|
| GET    | `/api/v1/stats/staff`  | Staff      | Staff dashboard    |
| GET    | `/api/v1/stats/admin`  | Admin only | Admin dashboard    |

---

## 🎨 Design System

GhanaDesk uses a custom CSS design system with CSS custom properties
(variables) for full consistency across all components.

```css
--primary:   #1D4ED8   /* Trust blue        */
--accent:    #F59E0B   /* Ghana gold         */
--success:   #10B981   /* Resolved green     */
--danger:    #EF4444   /* Open / urgent red  */
```

No Tailwind. No UI library. Pure CSS — fully custom and maintainable.

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- Auth via signed **JWT** tokens (7-day expiry)
- Routes protected by **role-based middleware**
- HTTP headers secured with **helmet**
- CORS restricted to client origin only
- Inactive accounts blocked at middleware level

---

## 📸 Screenshots

| Page              | Description                        |
|-------------------|------------------------------------|
| Landing Page      | Public hero with live ticket feed  |
| Submit Ticket     | Customer support form              |
| Track Ticket      | Real-time status timeline          |
| Staff Dashboard   | Agent ticket overview              |
| Admin Dashboard   | Full org stats + agent performance |
| Agents Page       | Create and manage support agents   |

---

## 🗺 Roadmap

- [ ] Email notifications on ticket updates
- [ ] File/image attachment support
- [ ] Analytics charts (ticket trends over time)
- [ ] Customer satisfaction ratings
- [ ] Multi-organization support (full SaaS mode)
- [ ] Mobile app (React Native)

---

## 👨🏾‍💻 Author

**Emmanuel Mensah (Emma)**
Founder, EM Control IT Solutions
📍 Accra, Ghana

> Building real SaaS products for the Ghanaian market.

---

## 📄 License

This project is open source and available under the
[MIT License](LICENSE).

---

<p align="center">
  Built with 🖤 in Ghana by
  <strong>EM Control IT Solutions</strong>
</p>
```