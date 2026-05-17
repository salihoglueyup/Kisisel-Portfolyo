# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/);
this project does not use strict semantic versioning.

## [Unreleased] — Security, Quality & Content Overhaul (2026-05)

A major hardening and content pass. Branch: `feature/security-quality-overhaul`.

### Security
- Moved the refresh token to an `httpOnly` cookie; access token shortened to
  15 min with transparent client-side refresh.
- Added stateless **double-submit CSRF** protection on `/auth/refresh` and
  `/auth/logout` (`X-CSRF-Token`, constant-time compare).
- Added **brute-force account lockout** (5 attempts → 15 min) on `AdminUser`.
- Added **token-based password reset** (hashed token, 1h expiry, no
  enumeration) with frontend Forgot/Reset pages.
- Hardened admin registration (`protect` + `superAdminOnly`, removed dead
  bootstrap branch); first admin via guarded `seedAdmin.js`.
- Added mass-assignment protection (`utils/pick`) on message/project/blog.
- Reordered middleware so Helmet covers all responses incl. `/uploads`;
  reduced body limit to 2 MB; generic 5xx messages in production.
- Guarded `seeder.js` against production and required `--force`.

### Fixed
- **Critical:** replaced `express-mongo-sanitize` with a custom Express 5–safe
  sanitizer (the library reassigned read-only `req.query`, breaking every
  request).
- **Critical:** fixed the Mongoose 9 `pre('save')` hook (no `next` callback) —
  previously broke `seedAdmin`, registration and password changes.
- Fixed `ErrorBoundary` using `process.env` in the browser (white-screen on
  crash) → `import.meta.env.DEV`.
- Fixed blog `views` race condition → atomic `$inc`.
- Fixed missing validation on PUT routes and upload/validation ordering
  (no more orphaned upload files).
- Fixed hard-coded copyright year → dynamic.

### Added
- Test suite: Jest + Supertest + `mongodb-memory-server` (20 tests);
  `app.js`/`index.js` split for testability.
- GitHub Actions CI (server tests + client lint/build); lockfiles committed.
- Contact → admin e-mail notification (Nodemailer, no-op if SMTP unset).
- Newsletter subscription (model + endpoint + reusable form).
- Functional meeting-request modal (replaces demo `alert`).
- Blog server-side search / category / pagination.
- SEO: dynamic `sitemap.xml`, JSON-LD (Person/WebSite/BlogPosting/ProfilePage/
  ContactPage), OpenGraph/Twitter meta, `robots.txt`.
- Project documentation: `LICENSE`, `docs/` (Architecture, Security, API,
  Deployment, Contributing, Changelog), rewritten `README.md`.

### Changed
- Repositioned the site identity from "YBS/MIS student" to
  **Full-Stack AI Engineer**; brand renamed to "Eyüp Zeki Salihoğlu".
- Replaced placeholder content with real CV/LinkedIn data: 7 internships,
  20+ certifications, 10 real projects, leadership/volunteering.
- About page restructured (professional-first ordering), Tech + Gear merged
  into a categorized section, certifications grouped by domain, Academic and
  filler sections removed.
- Projects filter aligned to real categories; TechTicker/SkillChart updated to
  the AI-focused stack.
- Models migrated to `timestamps: true`; ESLint config + cleanups (15 → 0
  errors); i18n dead keys removed.

## [1.0.0] — Initial Platform

- MERN portfolio platform: public site (Home/About/Projects/Blog/Contact),
  admin dashboard, JWT auth, MongoDB, i18n (TR/EN), PWA, animated UI.
