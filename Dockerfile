# syntax=docker/dockerfile:1

# AtlasCRM (apps/web) - Next.js + Prisma

FROM node:20-alpine AS deps
WORKDIR /repo

# Install dependencies for apps/web
COPY apps/web/package.json apps/web/package-lock.json ./apps/web/
RUN cd apps/web && npm ci

FROM node:20-alpine AS builder
WORKDIR /repo

COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1
# prisma.config.ts requires DATABASE_URL to exist during `prisma generate`.
# This is a build-time placeholder; at runtime you must provide a real DATABASE_URL.
ENV DATABASE_URL="postgresql://atlascrm:atlascrm@localhost:5432/atlascrm?schema=public"
WORKDIR /repo/apps/web

# Build (includes prisma generate via package.json)
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy runtime assets
COPY --from=builder /repo/apps/web/public ./public
COPY --from=builder /repo/apps/web/.next ./.next
COPY --from=builder /repo/apps/web/node_modules ./node_modules
COPY --from=builder /repo/apps/web/package.json ./package.json
COPY --from=builder /repo/apps/web/prisma ./prisma
COPY --from=builder /repo/apps/web/prisma.config.ts ./prisma.config.ts

USER nextjs
EXPOSE 3000

# Run migrations on boot, then start Next
CMD ["sh", "-c", "npx prisma migrate deploy && node_modules/.bin/next start -H 0.0.0.0 -p ${PORT}"]
