# Security Policy

Security is a first-class concern of this project. This document describes the
threat model, the controls that are implemented, how to report a vulnerability,
and known limitations.

## Reporting a Vulnerability

If you discover a security issue, **please do not open a public issue**.

- Email: **eyupzekisalihoglu@gmail.com**
- Include: affected endpoint/component, reproduction steps, impact, and any PoC.
- Expected first response: within a few days. Please allow reasonable time for
  a fix before public disclosure (coordinated disclosure).

## Supported Versions

This is an actively developed single-project repository. Only the latest
`main` branch is supported; fixes are applied there.

| Version | Supported |
|---|---|
| `main` (latest) | ✅ |
| older commits | ❌ |

## Threat Model

| Asset | Threat | Mitigation |
|---|---|---|
| Admin credentials | Brute force | Account lockout (5 attempts → 15 min), auth rate limit (5/15 min) |
| Session tokens | XSS theft | Refresh token in `httpOnly` cookie; access token short-lived (15 min) |
| Cookie-auth endpoints | CSRF | Stateless double-submit token (`X-CSRF-Token` vs cookie, constant-time compare) |
| Password storage | DB leak | `bcrypt` cost 12; `password` field `select:false` |
| User data | NoSQL injection | Custom key sanitizer strips `$`/`.` from body/query/params |
| Mass assignment | Privilege/field injection | Explicit field whitelisting (`utils/pick`) on writes |
| Admin creation | Privilege escalation | `protect` + `superAdminOnly`; first admin only via `seedAdmin.js` |
| Error responses | Internal info leak | 5xx messages genericised in production; stack hidden |
| Password reset | User enumeration / token replay | Generic responses; `sha256`-hashed token; 1h expiry; single-use |
| Uploads | Header/abuse | Helmet applies to `/uploads`; Multer type/size limits; Sharp re-encodes |
| Production data | Accidental wipe | Seeder blocked under `NODE_ENV=production`, requires `--force` |

## Implemented Controls

### Authentication & Session
- JWT **access token**, `expiresIn: 15m`, sent as `Authorization: Bearer`.
- **Refresh token** as an `httpOnly`, `secure` (prod), `sameSite` cookie scoped
  to `path=/api/auth` — unreadable by JavaScript.
- Transparent, single-shot refresh in the client interceptor (no infinite loop:
  `/auth/refresh` failures are not retried).
- **Brute-force lockout** on `AdminUser` (`failedLoginAttempts`, `lockUntil`):
  5 failures → 15 minute lock; counters reset on success.
- **Password reset**: hashed, time-limited (1h), single-use tokens; generic
  responses prevent account enumeration.
- **RBAC**: `admin` / `superadmin`; new admin accounts require a superadmin
  (`protect` + `superAdminOnly`); the dead "first-user bootstrap" branch was
  removed in favour of the guarded `seedAdmin.js` script.

### CSRF
- Random 32-byte token issued at login: a **readable** `csrfToken` cookie plus
  the same value in the login response body.
- `verifyCsrf` middleware on `/api/auth/refresh` and `/api/auth/logout` requires
  the `X-CSRF-Token` header to equal the cookie, compared with
  `crypto.timingSafeEqual`.
- Bearer-authenticated endpoints are not CSRF-exposed (no ambient credential).

### Transport, Headers & Input
- **Helmet** — security headers, applied before everything (covers `/uploads`).
- **CORS** — single allowed origin (`CLIENT_URL`), `credentials: true`,
  explicit `allowedHeaders` including `X-CSRF-Token`.
- **Rate limiting** — general `100/15min`; stricter `5/15min` on `/api/auth`.
- **HPP** — HTTP parameter pollution protection.
- **Custom NoSQL sanitizer** — recursively removes prohibited Mongo operator
  keys (`$…`, `.`) from `body`/`query`/`params`, mutating in place (Express 5
  makes `req.query` read-only, so reassigning — as `express-mongo-sanitize`
  does — throws; the custom middleware avoids this).
- **Body size limit** — `2mb` JSON/urlencoded; uploads capped by Multer.
- **express-validator** schemas on auth, project, blog, message, subscriber,
  forgot/reset-password; validation runs before file processing.

### Data & Operations
- **bcrypt** cost 12; secret fields `select:false`.
- **Field whitelisting** (`utils/pick`) on project/blog/message writes — public
  message creation cannot inject `isRead`/`createdAt`.
- **Atomic counters** — blog `views` via `$inc` (no read-modify-write race).
- **Centralised error handler** — known operational errors keep their message;
  unexpected 5xx return a generic message in production, stack never exposed.
- **Env validation** — server refuses to boot without
  `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.
- **Logging** — Winston (+ Morgan stream); full error detail stays server-side.

## Known Limitations / Hardening Backlog

- Refresh tokens are **stateless** (not server-tracked) — a stolen refresh
  cookie is valid until expiry; there is no server-side revocation list.
  Acceptable for the threat profile; a denylist/rotation could be added.
- Access token in `localStorage` remains XSS-reachable (kept short-lived to
  bound the blast radius). A fully in-memory access token would be stronger.
- No 2FA on the admin account.
- Rate limiting is per-instance in-memory (no shared store across replicas).
- CSP is Helmet's default; a strict, nonce-based CSP could be added.

These are conscious trade-offs documented for transparency, not oversights.

See also: [ARCHITECTURE.md](ARCHITECTURE.md)
