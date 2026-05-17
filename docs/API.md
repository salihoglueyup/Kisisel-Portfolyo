# API Reference

REST API for the portfolio platform.

- **Base URL (dev):** `http://localhost:5000/api`
- **Content type:** `application/json` (except image uploads → `multipart/form-data`)
- **Auth:** `Authorization: Bearer <accessToken>` for protected endpoints
- **CSRF:** `X-CSRF-Token: <csrfToken>` required on `/auth/refresh` & `/auth/logout`
- **Credentials:** requests must send cookies (`withCredentials: true`) so the
  `httpOnly` refresh cookie is included

## Conventions

### Success shape
```json
{ "success": true, "data": { /* ... */ }, "message": "optional" }
```

### Error shape
```json
{ "success": false, "message": "Human readable message" }
```
Validation errors (HTTP 400):
```json
{ "success": false, "message": "Validasyon hatası",
  "errors": [{ "field": "email", "message": "Geçerli bir email adresi giriniz" }] }
```

### Status codes
| Code | Meaning |
|---|---|
| 200 / 201 | OK / Created |
| 400 | Validation error |
| 401 | Missing/invalid token, bad credentials |
| 403 | CSRF failure / insufficient role |
| 404 | Not found |
| 413 | Payload too large |
| 429 | Rate limited / account locked |
| 500 | Server error (generic message in production) |

### Rate limits
- Global: **100 requests / 15 min** per IP.
- `/api/auth/*`: **5 requests / 15 min** per IP.

---

## Health & Meta

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | – | Liveness text response |
| GET | `/api/health` | – | `{ status, uptime, timestamp }` |
| GET | `/sitemap.xml` | – | Dynamic XML sitemap (static pages + projects + blogs) |

---

## Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | – | Authenticate, issue tokens |
| POST | `/refresh` | CSRF + refresh cookie | New access token |
| POST | `/logout` | CSRF | Clear refresh/CSRF cookies |
| POST | `/forgot-password` | – | Request reset link (generic response) |
| POST | `/reset-password/:token` | – | Set new password with token |
| POST | `/register` | Bearer + superadmin | Create a new admin |
| GET | `/profile` | Bearer | Current admin profile |
| PUT | `/profile` | Bearer | Update displayName/email |
| PUT | `/password` | Bearer | Change password |

### POST /api/auth/login
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@example.com", "password": "Secret123" }
```
**200**
```json
{
  "success": true,
  "message": "Giriş başarılı.",
  "data": {
    "id": "…", "email": "admin@example.com",
    "displayName": "Admin", "role": "superadmin",
    "accessToken": "<jwt 15m>",
    "csrfToken": "<hex>"
  }
}
```
Also sets cookies: `refreshToken` (`httpOnly`), `csrfToken` (readable).
**401** invalid credentials · **429** account locked / rate limited.

### POST /api/auth/refresh
Requires the `refreshToken` cookie and a matching `X-CSRF-Token` header.
```http
POST /api/auth/refresh
X-CSRF-Token: <csrfToken>
Cookie: refreshToken=<jwt>
```
**200** `{ "success": true, "data": { "accessToken": "<jwt 15m>" } }`
**403** CSRF mismatch · **401** missing/expired refresh token.

### POST /api/auth/forgot-password
```json
{ "email": "admin@example.com" }
```
Always **200** `{ "success": true, "message": "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi." }` (no enumeration).

### POST /api/auth/reset-password/:token
```json
{ "password": "NewSecret123" }
```
**200** on success · **400** invalid/expired token or weak password.

### POST /api/auth/register  *(superadmin only)*
```json
{ "email": "new@admin.com", "password": "Secret123", "displayName": "New", "role": "admin" }
```
**201** created (no tokens returned) · **401/403** without superadmin.

---

## Projects — `/api/projects`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | – | List all projects (newest first) |
| GET | `/:id` | – | Single project |
| POST | `/` | Bearer | Create (multipart, `image` file) |
| PUT | `/:id` | Bearer | Update (multipart) |
| DELETE | `/:id` | Bearer | Delete |

Create/update accept `multipart/form-data` with an optional `image` file
(processed to `.webp`); only whitelisted fields are persisted.

```json
// GET /api/projects → 200
{ "success": true, "data": [
  { "_id": "…", "title": "CBAM Guard", "description": "…",
    "tags": ["React","FastAPI","RAG"], "category": "AI / RAG",
    "metrics": { "complexity": 10, "hoursSpent": 180, "linesOfCode": 14000 },
    "links": { "github": "…", "live": "" }, "createdAt": "…" }
] }
```

---

## Blogs — `/api/blogs`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | – | List with search / category / pagination |
| GET | `/:id` | – | Single post (**increments `views`**) |
| POST | `/` | Bearer | Create (multipart) |
| PUT | `/:id` | Bearer | Update (multipart) |
| DELETE | `/:id` | Bearer | Delete |

**Query params** for `GET /`: `search`, `category`, `page` (default 1),
`limit` (default 50, max 50).

```json
// GET /api/blogs?search=node&category=Teknoloji&page=1&limit=6 → 200
{
  "success": true,
  "data": [ /* blog array */ ],
  "pagination": { "page": 1, "limit": 6, "total": 12, "totalPages": 2 }
}
```
`data` is always an array (backward compatible); `pagination` is additive.

---

## Messages — `/api/messages`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | – | Visitor sends a message (also e-mails admin) |
| GET | `/` | Bearer | List messages |
| PUT | `/:id/read` | Bearer | Mark as read |
| DELETE | `/:id` | Bearer | Delete |

```http
POST /api/messages
{ "name": "Jane", "email": "jane@x.com", "subject": "Proje Teklifi", "message": "Merhaba…" }
```
Only `name/email/subject/message` are accepted (mass-assignment safe). On
success, an admin notification is e-mailed if SMTP is configured (non-blocking).

---

## Subscribers — `/api/subscribers`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | – | Newsletter subscribe (idempotent) |
| GET | `/` | Bearer | List subscribers |

```http
POST /api/subscribers
{ "email": "fan@example.com" }
```
**201** new · **200** already subscribed (idempotent, no enumeration).

---

See also: [ARCHITECTURE.md](ARCHITECTURE.md) · [SECURITY.md](SECURITY.md)
