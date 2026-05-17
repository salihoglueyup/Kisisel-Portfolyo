# Deployment Guide

The frontend (Vite SPA) and backend (Express API) deploy **independently**.

```
  ┌───────────────┐      HTTPS REST       ┌───────────────┐
  │  Vercel        │ ───────────────────► │  Node host     │
  │  client/ (SPA) │   credentials:true   │  server/ (API) │
  └───────────────┘                       └──────┬────────┘
                                                  │
                                          ┌───────▼────────┐
                                          │ MongoDB Atlas   │
                                          └─────────────────┘
```

## 1. Prerequisites

- Node.js **≥ 18**
- MongoDB Atlas cluster (or any reachable MongoDB URI)
- A host for the API (Render, Railway, Fly.io, a VPS, …)
- Vercel account for the SPA
- (Optional) SMTP credentials for e-mail notifications

## 2. Environment Variables

### Backend — `server/.env`
```properties
NODE_ENV=production
PORT=5000
MONGO_URI=<atlas connection string>
JWT_SECRET=<long random string>
JWT_REFRESH_SECRET=<different long random string>
CLIENT_URL=https://your-frontend-domain        # exact SPA origin (CORS + cookies)
SEED_ADMIN_EMAIL=you@example.com
SEED_ADMIN_PASSWORD=<strong password>
SEED_ADMIN_NAME=Your Name
# Optional e-mail
SMTP_HOST=…
SMTP_PORT=587
SMTP_USER=…
SMTP_PASS=…
SMTP_FROM="Portfolio <no-reply@example.com>"
ADMIN_EMAIL=you@example.com
```
> The server **exits on boot** if `MONGO_URI`, `JWT_SECRET`, or
> `JWT_REFRESH_SECRET` are missing. Use strong, distinct secrets.

### Frontend — `client/.env`
```properties
VITE_API_URL=https://your-api-domain/api
```

### Cookie / CORS notes (important)
- In production the refresh cookie is `secure` + `sameSite=none`, so the API
  **must be served over HTTPS**.
- `CLIENT_URL` must be the **exact** SPA origin (scheme + host, no trailing
  slash) — it drives both CORS `origin` and cookie behaviour.
- If frontend and API are on different domains, `sameSite=none` is required
  (already handled in code for `NODE_ENV=production`).

## 3. Backend Deployment

```bash
cd server
npm ci
# set environment variables in the host dashboard (do NOT commit .env)
npm start            # node index.js
```
First-time data setup (run once against the production DB, locally or via a
one-off job — note the seeder is blocked when `NODE_ENV=production`, so run it
with `NODE_ENV` unset/`development` pointed at the prod `MONGO_URI`, carefully):
```bash
node seedAdmin.js              # creates the first superadmin from SEED_ADMIN_*
node seeder.js --force         # loads portfolio projects (wipes the collection!)
```
> `seeder.js --force` runs `deleteMany()` on projects. Only run intentionally.

Health check for uptime monitoring: `GET /api/health`.

## 4. Frontend Deployment (Vercel)

- **Root directory:** `client`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment:** `VITE_API_URL=https://your-api-domain/api`
- SPA routing: ensure all routes fall back to `index.html` (Vercel does this
  for Vite projects automatically; add a rewrite if needed).

`robots.txt` ships in `client/public`. The sitemap is **served by the API**
(`/sitemap.xml`); submit that URL (or proxy it from the frontend domain) to
search consoles.

## 5. CI/CD

`.github/workflows/ci.yml` runs on every push / PR to `main`:

| Job | Steps |
|---|---|
| **server** | `npm ci` → `npm test` (Jest + Supertest + in-memory Mongo) |
| **client** | `npm ci` → `npm run lint` → `npm run build` |

Lockfiles are committed so `npm ci` is reproducible. Vercel can auto-deploy on
push to `main` once the GitHub repo is connected.

## 6. Post-Deploy Checklist

- [ ] `GET /api/health` returns `200 { status: "ok" }`
- [ ] API is HTTPS (refresh cookie requires it in production)
- [ ] `CLIENT_URL` matches the deployed SPA origin exactly
- [ ] Login works and a `refreshToken` cookie is set (`httpOnly`, `Secure`)
- [ ] Token refresh works (no forced logout after 15 min)
- [ ] `seedAdmin.js` ran — you can log in at `/admin/login`
- [ ] `seeder.js --force` ran — projects appear on `/projects`
- [ ] Contact form submits; admin e-mail arrives (if SMTP configured)
- [ ] `/sitemap.xml` returns valid XML; `robots.txt` reachable
- [ ] Secrets are set via host env vars, **not** committed

See also: [ARCHITECTURE.md](ARCHITECTURE.md) · [SECURITY.md](SECURITY.md)
