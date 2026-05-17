# Architecture

In-depth overview of how the platform is structured, how requests flow, and the
key engineering decisions behind it.

## 1. System Overview

```
                ┌──────────────────────────────┐
                │          Browser               │
                │  React 19 SPA (Vite build)     │
                │  • TanStack Query (cache)      │
                │  • i18n (TR/EN) · PWA          │
                │  • localStorage: accessToken,  │
                │    csrfToken                   │
                └───────────────┬────────────────┘
                                │ HTTPS (Axios, withCredentials)
                                │ Authorization: Bearer <accessToken>
                                │ X-CSRF-Token: <csrfToken>
                                ▼
                ┌──────────────────────────────┐
                │      Express 5 API server      │
                │  Security middleware chain ►   │
                │  Routes ► Controllers ► Models │
                │  httpOnly refresh cookie       │
                └───────────────┬────────────────┘
                                │ Mongoose 9
                                ▼
                ┌──────────────────────────────┐
                │        MongoDB (Atlas)         │
                └──────────────────────────────┘

  Optional side channels:
   • Nodemailer (SMTP)  → contact / password-reset e-mails (no-op if unconfigured)
   • GET /sitemap.xml   → dynamic SEO sitemap from DB content
```

The frontend and backend are **deployed independently** (e.g. Vercel for the
SPA, a Node host for the API). They communicate purely over the REST API; the
only shared browser state is the access token (in memory/localStorage) and the
`httpOnly` refresh cookie.

## 2. Repository Layout

```
Kisisel-Portfolyo/
├── client/                  React + Vite frontend
│   └── src/
│       ├── api.js           Axios instance + interceptors (auth, CSRF, refresh)
│       ├── components/      common · charts · features · project
│       ├── pages/           Home · About · Projects · Blog · Contact · Admin
│       ├── hooks/queries/   TanStack Query data hooks
│       └── locales/         tr.json · en.json
├── server/                  Express API
│   ├── app.js               builds & exports the Express app (no listen)
│   ├── index.js             env validation → DB connect → listen
│   ├── config/              db.js · logger.js
│   ├── controllers/         auth · project · blog · message · subscriber · sitemap
│   ├── middleware/          auth · csrf · sanitize · error · validation · upload
│   ├── models/              AdminUser · Project · Blog · Message · Subscriber
│   ├── utils/               pick (field whitelist) · mailer
│   ├── tests/               Jest + Supertest (+ in-memory Mongo)
│   ├── seedAdmin.js         first superadmin
│   └── seeder.js            portfolio projects (--force)
└── .github/workflows/ci.yml CI pipeline
```

### `app.js` vs `index.js`

`app.js` constructs and exports the Express app **without** binding a port or
connecting to the database. `index.js` validates required environment
variables, connects to MongoDB, then `app.listen()`s. This split is what makes
the API testable with Supertest (the test suite imports `app` directly and
never opens a socket or needs a real DB beyond the in-memory instance).

## 3. Middleware Chain (order matters)

Requests pass through this exact order in `app.js`:

```
helmet()                     → security headers on EVERY response (incl. /uploads)
cors({ credentials, allowedHeaders:[…, X-CSRF-Token] })
morgan → winston             (skipped under NODE_ENV=test)
express.json({ limit:'2mb' })
express.urlencoded({ limit:'2mb' })
cookieParser()               → needed to read the httpOnly refresh cookie
mongoSanitize()              → custom, Express 5-safe NoSQL key stripper
hpp()                        → HTTP parameter pollution guard
/uploads static              → served AFTER helmet so headers apply
rate limiters                → general 100/15m; auth 5/15m (skipped in test)
routes
errorHandler                 → centralised error shape, 5xx leak prevention
```

**Why helmet first:** so security headers also cover static `/uploads`
responses. **Why sanitize after body/cookie parsing:** it operates on
`req.body`, `req.query`, `req.params` which must already be populated.

## 4. Authentication & Session Flow

Tokens:

- **Access token** — JWT, `expiresIn: 15m`, returned in the JSON body, sent by
  the client as `Authorization: Bearer`.
- **Refresh token** — JWT, `expiresIn: 7d`, set as an **`httpOnly` cookie**
  (`path=/api/auth`, `secure` + `sameSite=none` in production, `lax` in dev).
  JavaScript cannot read it → resistant to token theft via XSS.
- **CSRF token** — random 32 bytes, set as a **readable** cookie *and* returned
  in the login body. The client echoes it back as `X-CSRF-Token`. The server
  compares header vs cookie with `crypto.timingSafeEqual` (double-submit).

### Login

```
Client                          Server
  │  POST /api/auth/login         │
  │  { email, password }          │
  │ ─────────────────────────────►│ validateLogin
  │                               │ find user (+password)
  │                               │ isLocked()?  → 429 if locked
  │                               │ bcrypt.compare
  │                               │  fail → registerFailedLogin() → 401
  │                               │  ok   → resetLoginAttempts()
  │                               │ set refreshToken  (httpOnly cookie)
  │                               │ set csrfToken     (readable cookie)
  │ ◄─────────────────────────────│ 200 { accessToken, csrfToken, user }
  │  store accessToken+csrfToken  │
  │  in localStorage              │
```

### Authenticated request + transparent refresh

```
Client request ──(Bearer access)──► protect middleware
   401 (expired)
       │
       ▼  axios response interceptor (once, not for /auth/refresh)
   POST /api/auth/refresh
     Cookie: refreshToken=…           ← sent automatically
     X-CSRF-Token: <csrfToken>        ← from localStorage
       │
       ▼ verifyCsrf (header == cookie, timingSafeEqual)
       ▼ jwt.verify(refresh) → new 15m access token
   ◄── 200 { accessToken }
   retry original request with new token
```

### Logout

`POST /api/auth/logout` → `verifyCsrf` → clears both the refresh and CSRF
cookies; client clears `localStorage`.

### Password reset

`forgot-password` always returns a generic success (no user enumeration). If
the user exists: a `sha256`-hashed token + 1h expiry is stored, and a reset
link (`CLIENT_URL/admin/reset-password/<rawToken>`) is e-mailed.
`reset-password/:token` hashes the supplied token, matches a non-expired user,
sets the new password (validated), and clears the reset + lockout fields.

## 5. Data Models

| Model | Key fields | Notes |
|---|---|---|
| **AdminUser** | email, password*(select:false)*, displayName, role(`admin`/`superadmin`), lastLogin, failedLoginAttempts, lockUntil, resetPasswordToken*(select:false)*, resetPasswordExpire*(select:false)*, timestamps | `pre('save')` bcrypt hash (cost 12, Mongoose 9 async style — **no `next`**) |
| **Project** | title, description, image, tags[], category, role, status, date, technicalArchitecture, features[], metrics, links, timestamps | CRUD via admin; written through a field whitelist |
| **Blog** | title, excerpt, content, category, image, readTime, featured, views, timestamps | `views` incremented atomically with `$inc` (no race) |
| **Message** | name, email, subject, message, isRead, timestamps | public create is field-whitelisted; triggers admin e-mail |
| **Subscriber** | email (unique, lowercased), timestamps | idempotent subscribe |

`*select:false*` fields never leave the DB layer unless explicitly `.select`ed.

## 6. Request Lifecycle (example: create a project)

```
POST /api/projects  (multipart, Bearer)
  → rate limiter
  → protect            (verify Bearer, attach req.user)
  → upload.single      (Multer memory storage)
  → validateProject    (express-validator; 400 before any file write)
  → processImage       (Sharp → webp; runs only if validation passed)
  → createProject      (Project.create(pick(req.body, ALLOWED)))
  → errorHandler       (only on throw)
```

Validation runs **before** image processing so an invalid request never leaves
an orphaned upload on disk.

## 7. Key Decisions & Trade-offs

- **httpOnly refresh + short access token** over localStorage-only tokens:
  mitigates XSS token theft; cost is a refresh round-trip every 15 min
  (handled transparently by the axios interceptor).
- **Stateless double-submit CSRF** over server-side session CSRF: no session
  store needed; works with the independently-deployed SPA.
- **Custom NoSQL sanitizer** instead of `express-mongo-sanitize`: the upstream
  library reassigns `req.query`, which is read-only in Express 5 and threw on
  every request. The custom middleware mutates in place.
- **`app.js` / `index.js` split**: testability without a live port or DB.
- **Category-based project filtering** over tag matching: aligns the UI filter
  with the real portfolio taxonomy.
- **Seeder guarded** (`--force`, blocked under `NODE_ENV=production`):
  `deleteMany()` is destructive; the guard prevents accidental data loss.

See also: [SECURITY.md](SECURITY.md) · [API.md](API.md) · [DEPLOYMENT.md](DEPLOYMENT.md)
