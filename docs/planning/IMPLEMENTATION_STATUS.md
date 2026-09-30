# Implementation Status

Last updated: 2026-09-29

- ✅ Requirements inventory and conflict resolution completed.
- ✅ Repository initialized on `feat/project-foundation`.
- 🟡 Prisma client/service and simulation-run repository are implemented; migrations still await application against PostgreSQL.
- ✅ Deterministic Python kernel now supports staged events, social edges, simultaneous transitions and reproducible Monte Carlo summaries.
- ✅ NestJS and Next.js application shells have passed TypeScript validation and production build validation.
- ✅ GitHub Actions CI validates Prisma, TypeScript quality/build, Python engine tests and Compose configuration.
- 🟡 Tenant context and RBAC primitives are implemented and tested; OIDC validation and persistence integration remain pending.
- 🟡 Decision creation and immutable scenario publication services are implemented and tested; REST DTO/controller and live database integration remain pending.
- 🟡 Idempotent worker orchestration contract and unit tests are implemented; BullMQ runtime wiring, Prisma repository and SSE remain pending.
- 🟡 Run creation now freezes and hashes scenario input with idempotency before queueing; concrete BullMQ adapter, outbox and SSE remain pending.
- 🟡 Provider-neutral model gateway, structured decision contract, budget enforcement and deterministic fallback are implemented; provider adapters, prompt registry and tracing remain pending.
- ⬜ Calibration, observability and production hardening remain pending.

Decisions: BullMQ/Redis is the MVP orchestration boundary; FastAPI/Python is computation-only; LLM output is structured and cannot write agent state directly.

Next task: apply the reviewed migration once Docker is available, then implement identity and tenant guards.

Risks: Docker Desktop is unavailable, so the Compose runtime and migration application are blocked. Technical debt: the first schema deliberately defers engine trace/vector tables until the engine contract stabilizes.

