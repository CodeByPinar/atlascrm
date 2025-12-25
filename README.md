# AtlasCRM

![AtlasCRM – Next.js + Prisma CRM](apps/web/banner.jpeg)

![AtlasCRM](apps/web/logo.png)

Next.js + Prisma CRM with a modern admin panel: Leads CRUD, Customers, Tasks, Billing, and built-in authentication.

## Highlights

- Admin modules: Leads (CRUD), Customers, Tasks, Billing, Users, Activities
- Multi-organization data model + role-based admin access
- Server Actions + Prisma migrations (PostgreSQL)
- Auth flows: register, login, forgot/reset password

## Tech Stack

- Next.js (App Router) + React
- TypeScript + Tailwind CSS
- Prisma + PostgreSQL

## Monorepo Layout

- `apps/web` → Next.js application
- `apps/web/prisma` → Prisma schema + migrations
- `apps/web/src/server` → server actions, auth, Prisma client

## Getting Started

### Prerequisites

- Node.js (recommended: 18+)
- A PostgreSQL database

### 1) Install dependencies

```bash
npm --prefix apps/web install
```

### 2) Configure environment

Create `apps/web/.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
```

### 3) Prepare the database (migrations)

```bash
cd apps/web
npx prisma migrate dev
```

### 4) Run the app

From the repo root:

```bash
npm run dev
```

Open http://localhost:3000

## Useful Commands

From repo root:

- `npm run dev` → runs `apps/web` (Next dev server)
- `npm run build` → `prisma generate` + production build
- `npm run start` → start production server

From `apps/web`:

- `npx prisma generate` → regenerate Prisma Client
- `npx prisma migrate dev` → apply migrations in development
- `npx prisma migrate deploy` → apply migrations in production

## Docker

### Build & run (with local Postgres)

```bash
docker compose up --build
```

This starts:

- Web: http://localhost:3000
- Postgres: localhost:5432 (user/pass/db: `atlascrm`)

The container runs `prisma migrate deploy` on boot.

### Stop

```bash
docker compose down
```

## Render Deploy

This repo includes a `render.yaml` blueprint.

1) In Render: **New** → **Blueprint** → select this GitHub repo
2) Render provisions:
	- a Postgres database (`atlascrm-db`)
	- a web service built from the `Dockerfile`
3) Deploy. The container automatically runs `prisma migrate deploy` on startup.

## Notes

- `.env*` is gitignored by default (don’t commit secrets).
- Password reset emails are not sent yet; in development a reset link is printed to the server console.
