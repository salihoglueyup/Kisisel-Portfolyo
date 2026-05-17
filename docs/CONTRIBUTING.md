# Contributing

This is primarily a personal project, but the workflow below keeps the codebase
clean and reviewable. Contributions and suggestions are welcome.

## Development Setup

```bash
git clone https://github.com/salihoglueyup/Kisisel-Portfolyo.git
cd Kisisel-Portfolyo
npm run install:all
```

Create `server/.env` and `client/.env` from their `.env.example` files
(see [DEPLOYMENT.md](DEPLOYMENT.md) for the full list). For local work you can
use a local MongoDB and any non-empty `JWT_SECRET` / `JWT_REFRESH_SECRET`.

Seed local data:
```bash
cd server
node seedAdmin.js
node seeder.js --force
cd ..
npm run dev          # server + client together
```

## Branching & Commits

- Branch off `main`: `feat/<short-desc>`, `fix/<short-desc>`,
  `chore/<short-desc>`, `docs/<short-desc>`.
- **Never commit directly to `main`.**
- Conventional, imperative commit subjects, grouped by concern. Examples:
  - `feat(server): add newsletter subscription endpoint`
  - `fix(client): prevent infinite refresh loop on 401`
  - `chore: CI + lockfile tracking`
- Keep commits focused; don't bundle unrelated changes.
- Never commit secrets or `.env` files. Lockfiles **are** committed.

## Quality Gates (must pass before a PR)

Run locally — CI runs the same:

```bash
cd server && npm test          # Jest + Supertest, must be green
cd ../client && npm run lint   # ESLint, 0 errors
cd client && npm run build     # production build must succeed
```

- Backend tests: **all passing** (no skipped/partial).
- Client lint: **0 errors** (warnings tolerated for the known accepted set).
- Build: **succeeds**.
- If you change behaviour, add/adjust a test.

## Code Conventions

- Match the surrounding style (indentation, naming, comment density).
- **Backend:** controllers stay thin; validation in `middleware/validation`;
  never trust `req.body` directly — write through `utils/pick`.
- **Security:** don't weaken the middleware order or auth flow; see
  [SECURITY.md](SECURITY.md) before touching auth/CSRF/sanitize.
- **Frontend:** data fetching via TanStack Query hooks in `hooks/queries`;
  user-facing strings go through i18n where the surrounding code does.
- **Mongoose 9:** `pre('save')` hooks are `async` and **take no `next`** —
  just return/throw.

## Pull Requests

1. Ensure all quality gates pass.
2. Describe **what** changed and **why**; note any security impact.
3. Keep the PR scoped; large mixed PRs will be asked to split.
4. Update the relevant doc (`docs/`) and `CHANGELOG.md` when behaviour changes.

## Reporting Issues

- Bugs: clear repro steps, expected vs actual, environment.
- Security: **do not** open a public issue — see [SECURITY.md](SECURITY.md).
