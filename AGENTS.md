# MonetizeKit Agent Guide

## Project Summary

MonetizeKit is an open-source developer toolkit for monetizing software, APIs, and digital features. The core web app is a Next.js 16 App Router application backed by Better Auth (GitHub OAuth), tRPC v11, Prisma (Postgres), and Redis. Current scope includes org onboarding (sign-in, create org, dashboard) and foundational tRPC setup.

## Goals

- Provide a production-grade SaaS foundation: auth, orgs, usage, entitlements, API keys, billing.
- Maintain strict typesafety across tRPC + Prisma + UI.
- Keep server and client boundaries clear (App Router, RSC-friendly patterns).

## Repository Structure (key paths)

- `apps/web/` Next.js 16 App Router app
- `apps/web/app/` route handlers + pages (RSC)
- `apps/web/server/` tRPC server, context, routers
- `apps/web/lib/` client utilities (tRPC client, auth client)
- `packages/config/` shared validation (Zod)
- `packages/db/prisma/` schema + migrations
- `packages/db/generated/prisma/` Prisma Client output

## Commands

All commands use Bun. Run from repo root unless noted.

### Root

- Dev: `bun run dev` (Turbo)
- Build: `bun run build` (Turbo)
- Lint: `bun run lint`
- Typecheck: `bun run typecheck`
- Format: `bun run format`

### Web app (App Router)

Run from `apps/web`:

- Dev: `bun run dev`
- Build: `bun run build`
- Start: `bun run start`
- Lint: `bun run lint`

### Prisma

Run from repo root:

- Generate client: `bunx prisma generate`
- Migrate dev: `bunx prisma migrate dev --name <migration_name>`
- Reset DB (destructive): `bunx prisma migrate reset --force`

### Shadcn

- Import common components such as Button, Badge, Input, etc. from shadcn whenever possible
- Always use `bunx shadcn@latest add <component>`
- Never import the code manually

### Tests

No automated test runner is configured yet.

- Single test: not available (add a test framework first).

## Environment Files

- `apps/web/.env.local` for runtime envs (Better Auth, GitHub OAuth, DB, Redis)
- Root `.env` is used by Prisma CLI via `prisma.config.ts`
- Do not commit secrets. Use `.env.local` only.

Required (web):

```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
DATABASE_URL=postgresql://...
REDIS_URL=rediss://...
REDIS_TLS=true
```

## tRPC (App Router)

- Server handler: `apps/web/app/api/trpc/[trpc]/route.ts` (fetch adapter)
- Context: `apps/web/server/context.ts`
- Router: `apps/web/server/routers/_app.ts`
- Protected procedure: `protectedProcedure` in `apps/web/server/trpc.ts`
- Org-scoped procedure: `orgProcedure` in `apps/web/server/trpc.ts`
- Org-owner procedure: `orgOwnerProcedure` in `apps/web/server/trpc.ts`
- Routers: `org`, `project`, `apiKey` in `apps/web/server/routers/*`
- Client utilities: `apps/web/lib/trpc/*`

## Auth (Better Auth)

- Server: `apps/web/lib/auth.ts` (Better Auth instance)
- Client: `apps/web/lib/auth-client.ts`
- Auth route: `apps/web/app/api/auth/[...all]/route.ts`

## Prisma Notes

- Prisma client output is **custom**: `packages/db/generated/prisma`.
- Use the shared DB package: `import { createPrismaClient } from '@monetizekit/db'`.
- Schema: `packages/db/prisma/schema.prisma`.
- Migrations: `packages/db/prisma/migrations/`.

## Code Style

- TypeScript strict mode is enabled.
- Prettier config enforces:
  - single quotes
  - semicolons
  - trailing commas
  - 100 char line width
- ESLint is configured for Next.js + TypeScript.

### Imports

- Prefer absolute imports via alias: `@/` for `apps/web`.
- Order imports: external packages, then internal `@/`, then relative.
- Avoid unused imports.

### Types & Validation

- Prefer Zod schemas for API input validation.
- Keep Zod schemas in `packages/config` when shared.
- Use `protectedProcedure` for auth-required tRPC endpoints.
- Validate whenever possible.

### Naming

- Components: `PascalCase` for React components.
- Functions/variables: `camelCase`.
- Files: `kebab-case` or `snake_case` only if required by framework.

### Error Handling

- Use `TRPCError` for API errors.
- Surface user-friendly messages in UI.
- Do not leak internal errors to the client.

## Best Practices

- Maintain server/client boundary: no server-only code in client components.
- Keep tRPC context minimal and serializable.
- Prefer explicit returns from procedures (avoid `any`).
- When adding new domains, add router + schema + UI together.
- Update 'Suggested Next Tasks' in `AGENTS.md` after completetion of every task

## Documentation Rule (Context7)

- Always use Context7 MCP for library/API documentation, code generation, setup, or configuration steps.
- Do this proactively without the user needing to ask.

## Existing Rules Files

- Cursor rules are present in `.cursor/rules/`.
- No Copilot rules found (`.github/copilot-instructions.md`).

## Known Gaps

- No tests configured yet.
- No CI pipeline.
- No billing (Stripe) wiring yet.

## Suggested Next Tasks

- Add API key verification utilities for request auth.
- Add usage metering.
- Add Usage and Billing sidebar sections with placeholder states.
- Add deep-link routing for sidebar sections (URL state).
- Add project-level settings (rename, delete) with safeguards.
- Add org member invites UI polish (resend/copy link).
