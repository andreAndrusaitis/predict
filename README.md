# Predict

Predict is a decision-intelligence platform for comparing simulated scenarios with synthetic populations. It combines deterministic agent-based modelling, social networks, controlled randomness and optional structured AI reasoning. A simulated frequency is not represented as a real-world probability unless the model is calibrated for that use.

## Architecture

- `apps/web`: Next.js product interface.
- `apps/api`: NestJS transactional API and public domain boundary.
- `apps/worker`: BullMQ orchestration boundary.
- `services/simulation-engine`: Python scientific computation service.
- `packages`: shared contracts and configuration.
- `prisma`: PostgreSQL schema and migrations.

## Current readiness

The repository contains a working TypeScript/API/worker foundation, deterministic Python engine, database migrations and local test suite. It is **not yet an end-user-ready product**: OIDC login, account registration, a concrete OpenAI provider adapter, database migration application, and web decision workflows remain to be completed.

## Local development

Prerequisites: Node 22+, pnpm 11+, Python 3.12+ and Docker Desktop.

1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` only when the provider adapter is enabled. It must never be prefixed with `NEXT_PUBLIC_`.
3. Install dependencies: `pnpm install`.
4. Start PostgreSQL/pgvector and Redis: `docker compose up -d postgres redis`.
5. Apply database migrations: `pnpm exec prisma migrate deploy --schema prisma/schema.prisma`.
6. Generate Prisma client: `pnpm exec prisma generate --schema prisma/schema.prisma`.
7. In separate terminals, run `pnpm --filter @predict/api start`, `pnpm --filter @predict/web dev`, and the worker runtime once its repository/engine adapters are configured.

## Verification

Run `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm exec prisma validate --schema prisma/schema.prisma`, and `python -m unittest discover tests` from `services/simulation-engine`.

## API keys and users

The key belongs only to the backend environment. The web application must call the API; it never receives database or provider credentials. User registration/login is intentionally not implemented with a fake local-password flow: the target is OIDC/OAuth2, then organization memberships and roles are loaded server-side. The existing tenant/RBAC guards are ready to enforce that principal after the OIDC adapter is added.

Detailed engineering plan: `docs/planning/MASTER_PLAN.md`.

