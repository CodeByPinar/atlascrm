# AtlasCRM Web

The web application for AtlasCRM — built with Next.js (App Router) + Prisma.

## Features

- Modern admin panel modules: Leads (CRUD), Customers, Tasks, Billing, Users, Activities
- Authentication flows: register, login, forgot/reset password
- Multi-organization data model with role-based admin access

## Tech Stack

- Next.js 14 (App Router)
- Prisma + PostgreSQL
- TypeScript + Tailwind CSS

## Prerequisites

- Node.js (recommended: 18+)
- A PostgreSQL database

## Setup

### 1) Install

From this folder:

```bash
npm install
```

Or from repo root:

```bash
npm --prefix apps/web install
```

### 2) Environment

Create `apps/web/.env` (this file is gitignored):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
```

### 3) Database migrations

```bash
npx prisma migrate dev
```

### 4) Run dev server

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` → start Next.js dev server
- `npm run build` → `prisma generate` + production build
- `npm run start` → run production server (after build)
- `npm run lint` → lint
- `npm run typecheck` → TypeScript typecheck

## Prisma Notes

- Prisma config lives in `prisma.config.ts` and requires `DATABASE_URL`.
- If you add/rename models, regenerate the client:

```bash
npx prisma generate
```

If VS Code shows types like “Property 'lead' does not exist on PrismaClient”, restart the TypeScript server (and the dev server) after generating.

## Project Structure

- `src/app` → Next.js routes (App Router)
- `src/server` → server actions, auth, Prisma client
- `prisma/schema.prisma` → data model
- `prisma/migrations` → migrations
