## FocusFlow - Minimal Authenticated Todo App

FocusFlow is a multi-tenant todo list built with the Next.js App Router. Users authenticate with Google via NextAuth, and every task is persisted in Postgres through Prisma. The UI is intentionally minimal, responsive, and fully powered by Tailwind CSS with reusable building blocks.

### Highlights

- **Auth**: Google OAuth via NextAuth (database sessions, Prisma adapter, middleware-protected routes).
- **Persistence**: PostgreSQL + Prisma schema with migrations and type-safe server helpers.
- **API-first**: RESTful routes under `/api/tasks` for listing/searching/pagination, creation, and toggling completion.
- **UX**: Accessible Tailwind components, optimistic interaction hints, search + pagination, and clear empty states.
- **Quality**: Vitest-powered unit tests for helpers/validation plus documented setup/testing instructions.

---

## 1. Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional but recommended for Postgres)

### Installation

```bash
npm install
```

Copy the sample env file and populate secrets:

```bash
cp env.example .env
```

| Key | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (e.g. local Docker DB). |
| `NEXTAUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`). |
| `NEXTAUTH_SECRET` | Random 32+ char string (`openssl rand -base64 32`). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credentials from Google Cloud console (OAuth consent screen + Web app client). |

### Local Postgres (Docker)

```bash
docker compose up -d
npm run db:push   # or npm run db:migrate after editing schema
```

This boots Postgres on `5432` with the credentials from `env.example`.

### Prisma workflow

- `npm run db:generate` - regenerate the Prisma client.
- `npm run db:push` - sync schema to dev DB without migrations.
- `npm run db:migrate` - create & apply named migrations.

### Development server

```bash
npm run dev
```

Navigate to `http://localhost:3000`. You will be redirected to `/signin`, where you can log in with Google. Once authenticated, the `/tasks` page unlocks task management.

---

## 2. API Contract

All routes require authentication (NextAuth middleware enforces this). Errors return `{ message: string }`.

| Method & Path | Description | Parameters |
| --- | --- | --- |
| `GET /api/tasks` | List tasks with optional search and pagination. | Query params: `q` (title contains, case-insensitive), `page` (default 1), `pageSize` (default 10, max 100). |
| `POST /api/tasks` | Create a task. | Body: `{ "title": string }` (1-200 chars). |
| `PATCH /api/tasks/:id/toggle` | Toggle completion for the owner's task. | URL param `id` (task id). |

Responses for `GET /api/tasks`:

```json
{
  "items": [{ "id": "...", "title": "...", "done": false, "createdAt": "ISO" }],
  "page": 1,
  "pageSize": 10,
  "total": 25,
  "totalPages": 3
}
```

Common statuses: `401` (unauthorized), `403` (reserved for future fine-grained checks), `404` (task not found), `400` (validation), `500`.

---

## 3. Testing & Quality

```bash
npm run lint
npm run test
```

- **Lint**: Next.js ESLint config.
- **Unit tests**: Vitest covers pagination helpers and task validation schemas (`npm run test -- --watch` for TDD).

---

## 4. Project Structure

```
src/
  app/            # App Router routes (layout, auth, tasks, API)
  components/     # Reusable UI (forms, lists, pagination, layout, providers)
  helpers/        # Client-side helpers (fetch wrapper, pagination math)
  hooks/          # Reusable hooks (URL/search state)
  interfaces/     # Component contract interfaces (Task UI shapes)
  lib/            # Server utilities (Prisma client, auth config, validation)
  server/         # Prisma-powered domain services
```

Guiding principles:

- All components are Tailwind-only, under 600 LOC, reusable, and typed via `src/interfaces`.
- Hooks/helpers stay outside component files per repo conventions.
- Prisma is the single source of truth for DB access; APIs and server components rely on the same service layer.

---

## 5. Deployment Tips

1. Provision a managed Postgres instance (Neon, Supabase, RDS, etc.) and update `DATABASE_URL`.
2. Configure Google OAuth redirect URIs for your deployment URL.
3. Set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and the Google credentials in your hosting provider.
4. Run `npm run db:migrate` against the production database before starting the app.

---

## 6. Future Enhancements

- Task ordering drag-and-drop.
- Bulk actions + batch API endpoints.
- Push notifications or daily reminder emails.
- Accessibility pass with automated tooling (axe, Lighthouse).

PRs and suggestions are welcome - have fun building on top of FocusFlow!
