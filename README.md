# Eyüp Zeki Salihoğlu — Portfolio Platform

> A production-grade, full-stack personal platform built by a **Full-Stack AI Engineer**.
> Not just a static portfolio — a secure MERN application with a custom CMS, JWT/cookie auth, automated tests and CI.

[![CI](https://github.com/salihoglueyup/Kisisel-Portfolyo/actions/workflows/ci.yml/badge.svg)](https://github.com/salihoglueyup/Kisisel-Portfolyo/actions/workflows/ci.yml)
![Stack](https://img.shields.io/badge/stack-MERN-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

🔗 **Live demo:** [salihoglueyup.vercel.app](https://salihoglueyup.vercel.app)

![Screenshot](docs/screenshot.png)
<sub>Add a real screenshot at `docs/screenshot.png`.</sub>

---

## ✨ Highlights

- **Custom CMS / Admin dashboard** — CRUD for projects, blog posts, messages; profile & password management.
- **Public site** — bilingual (TR/EN), PWA, SEO (dynamic `sitemap.xml`, JSON-LD), animated UI, blog with **server-side search / category / pagination**.
- **Contact & growth** — contact form with admin e-mail notification, newsletter subscription, meeting request.
- **Engineering quality** — 20 automated tests, GitHub Actions CI, lint-clean, reproducible builds (committed lockfiles).

## 🔐 Security (the differentiator)

This platform was hardened well beyond a typical portfolio:

- **Auth:** short-lived JWT access token (15 min) + **refresh token in an `httpOnly` cookie** (XSS-resistant).
- **CSRF:** stateless **double-submit token** on cookie-driven endpoints (`/auth/refresh`, `/auth/logout`).
- **Brute-force protection:** account lockout after repeated failed logins.
- **Password reset:** token-based flow, reset token stored hashed, generic responses (no user enumeration).
- **RBAC:** `admin` / `superadmin` roles; admin creation restricted to superadmin.
- **Hardening:** Helmet, restricted CORS, rate limiting (global + auth), HPP, an **Express 5–compatible NoSQL sanitizer**, `bcrypt` (cost 12), mass-assignment protection (field whitelisting), 5xx error-message leakage prevention.
- **Ops:** Winston + Morgan logging, env-var validation on boot, destructive seeder guarded against production.

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS, Framer Motion, React Router 7, TanStack Query, react-hook-form + Zod, i18next, vite-plugin-pwa, Recharts |
| **Backend** | Node.js, Express 5, Mongoose 9, JWT, bcryptjs, Helmet, express-rate-limit, hpp, Multer + Sharp, Nodemailer, Winston |
| **Database** | MongoDB (Atlas) |
| **Testing / CI** | Jest, Supertest, mongodb-memory-server, ESLint, GitHub Actions |
| **Tooling** | Vite, Nodemon, Concurrently, Git |

## 🚀 Getting Started

### Prerequisites
- Node.js **≥ 18**
- A MongoDB connection string (local or Atlas)

### 1. Clone & install
```bash
git clone https://github.com/salihoglueyup/Kisisel-Portfolyo.git
cd Kisisel-Portfolyo
npm run install:all   # installs root, client and server dependencies
```

### 2. Environment variables

**`server/.env`** (see `server/.env.example`):
```properties
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
CLIENT_URL=http://localhost:5173

# First superadmin (used only by `node seedAdmin.js`)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change_this_strong_password
SEED_ADMIN_NAME=Admin

# Optional — e-mail notifications (no-op if unset)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Portfolio <no-reply@example.com>"
ADMIN_EMAIL=admin@example.com
```

> `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET` are **required** — the server refuses to start without them.

**`client/.env`** (see `client/.env.example`):
```properties
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed data
```bash
cd server
node seedAdmin.js              # create the first superadmin (from SEED_ADMIN_* env)
node seeder.js --force         # load portfolio projects (wipes the projects collection)
cd ..
```

### 4. Run
```bash
npm run dev          # runs server + client together (concurrently)
# or individually:
npm run dev:server
npm run dev:client
```

App: `http://localhost:5173` · API: `http://localhost:5000/api` · Admin: `/admin/login`

## 📜 Scripts (root)

| Script | Description |
|---|---|
| `npm run dev` | Run server and client concurrently |
| `npm run dev:server` / `dev:client` | Run a single side |
| `npm run build` | Build the client for production |
| `npm start` | Start the server (production) |
| `npm run install:all` | Install root + client + server deps |
| `npm run lint` | Lint the client |

## 🧪 Testing & CI

```bash
cd server && npm test     # Jest + Supertest + mongodb-memory-server (20 tests)
```

GitHub Actions (`.github/workflows/ci.yml`) runs on every push / PR to `main`:
- **server** — installs deps, runs the test suite
- **client** — installs deps, lints, builds

## 📂 Project Structure

```text
Kisisel-Portfolyo/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── api.js           # Axios instance (auth + CSRF interceptors)
│       ├── components/      # common, charts, features, project
│       ├── pages/           # Home, About, Projects, Blog, Contact, Admin
│       ├── hooks/queries/   # TanStack Query hooks
│       └── locales/         # i18n (tr, en)
├── server/                  # Express API
│   ├── app.js               # Express app (testable, no listen)
│   ├── index.js             # Env validation, DB connect, listen
│   ├── config/              # db, logger
│   ├── controllers/         # auth, project, blog, message, subscriber, sitemap
│   ├── middleware/          # auth, csrf, sanitize, error, validation, upload
│   ├── models/              # AdminUser, Project, Blog, Message, Subscriber
│   ├── routes/              # API routes
│   ├── utils/               # pick (mass-assignment), mailer
│   ├── tests/               # Jest + Supertest suites
│   ├── seedAdmin.js         # create first superadmin
│   └── seeder.js            # load portfolio projects (--force)
└── .github/workflows/ci.yml # CI pipeline
```

## 👤 Author

**Eyüp Zeki Salihoğlu** — Full-Stack AI Engineer

- 🌐 [salihoglueyup.vercel.app](https://salihoglueyup.vercel.app)
- 💼 [LinkedIn](https://www.linkedin.com/in/eyupzekisalihoglu/)
- 🐙 [GitHub](https://github.com/salihoglueyup)

## 📄 License

Released under the **MIT License**.
