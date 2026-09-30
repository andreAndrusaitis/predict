# Predict Master Plan

## Product vision

Predict is a decision-intelligence platform that lets teams model a decision, define assumptions, generate synthetic populations, execute repeatable simulations and compare scenario distributions. It supports decision makers; it does not make automated high-impact decisions or claim uncalibrated simulation output is factual probability.

## Requirements

Functional requirements are decision/project management, immutable scenario versions, synthetic populations and networks, seeded simulation runs, asynchronous execution/progress, Monte Carlo aggregation, explainability, comparison, audit history, role-based access and a controlled model gateway. Non-functional requirements are tenant isolation, reproducibility, idempotency, structured observability, accessibility (WCAG AA), resilience, cost limits and cloud portability.

## Architecture and module boundaries

The web client uses Next.js. NestJS owns public REST/OpenAPI APIs, authentication, authorization, domain persistence and job creation. PostgreSQL is the source of truth through Prisma. Redis and BullMQ coordinate jobs but never own business state. The Python engine receives an immutable run specification and returns typed artifacts; it does not access transactional tables. ModelGateway owns provider calls, schemas, budgets, tracing and prompt versions.

## Delivery phases

| Phase | Implementable tasks | Acceptance criteria |
| --- | --- | --- |
| 0 Foundation | monorepo, Compose, CI, environment contract, ADRs, engine test baseline | fresh clone has documented local bootstrap; deterministic kernel tests pass |
| 1 Identity | OIDC integration, organization membership, RBAC, tenant guard, audit log | cross-tenant API access is denied and tested |
| 2 Decision Lab | project, decision, versioned scenario CRUD, OpenAPI client, builder | a modeler creates and publishes immutable scenario v1 |
| 3 Population | archetypes, distribution validation, network generator, population version | generated population satisfies declared marginals/tolerances |
| 4 Run pipeline | simulation/run entities, BullMQ worker, idempotency, SSE, cancel | request returns immediately and terminal run state persists |
| 5 ABM core | events, perception, constraints, simultaneous transitions, checkpoints, metrics | same snapshot and seed replay identically without LLM |
| 6 AI control | ModelGateway, strict structured decision, budgets, prompt/model registry | invalid output cannot alter official state; all calls are traced |
| 7 Analysis | Monte Carlo, quantiles, compare, export, uncertainty UI | scenario output shows distributions and assumptions, never false certainty |
| 8 Validation | golden scenarios, sensitivity, ablation, calibration datasets | releases reject behavior regressions outside declared tolerance |
| 9 Hardening | OTel, SLOs, load/security tests, backups, retention/runbooks | production-candidate operational gates pass |

## Sprint backlog

Sprint 01 completes phase 0: package workspaces, Docker Compose, Prisma baseline, lint/type/test automation and ADRs. Sprint 02 builds identity and tenant enforcement. Sprint 03 adds project/decision/scenario versioning. Sprint 04 builds population generation and validation. Sprint 05 completes async runs and live monitoring. Sprint 06 hardens the deterministic kernel. Sprint 07 adds the model gateway. Sprint 08 implements Monte Carlo and result comparison. Sprint 09 adds memory/calibration. Sprint 10 is production hardening. Each story must include objective, owner, dependencies, test evidence and acceptance criteria before it is started.

## API and data strategy

External APIs are REST under `/v1`, documented as OpenAPI. Run-start APIs accept `Idempotency-Key`; progress uses SSE with GET reconciliation after reconnect. First migration contains identity, project, decision, immutable scenario and run metadata. Engine-specific state, traces and vectors follow only after contracts stabilize. Large traces move to object storage with a database hash, URI and schema version.

## Test strategy

Use unit and integration tests for TypeScript; pytest/unittest plus property, seed, golden, metamorphic and statistical tests for the engine; contract tests for service boundaries; Playwright for end-to-end journeys. CI runs format, lint, typecheck, test, build and migration validation. Model changes add schema-adherence and drift evaluations.

## Deployment strategy

Compose provides local PostgreSQL/pgvector and Redis. Immutable containers move through dev, stage and production, with migrations deployed before compatible application rollout. Azure Container Apps, PostgreSQL Flexible Server, managed Redis, Blob Storage, Key Vault and OpenTelemetry are the initial reference, not a vendor lock-in.

## Release criteria

MVP requires a user to create an organization/project/decision/scenario/population, launch a non-blocking seeded run, follow progress and inspect a labeled simulation distribution. Beta adds controlled LLM decisions, Monte Carlo comparison and validation tooling. Production requires RBAC/tenant tests, backups, SLO monitoring, retention, security review, calibration evidence for any calibrated claim and operational runbooks.

## Risks and controls

Key risks are simulated certainty, LLM cost/drift, tenant leakage, overly homogeneous agents, invalid topology, sensitive data ingestion and unbounded traces. Controls are explicit labels, deterministic fallback and budgets, tenant-scoped queries/tests, distribution/network validation, data minimization and retention/object storage policies.

