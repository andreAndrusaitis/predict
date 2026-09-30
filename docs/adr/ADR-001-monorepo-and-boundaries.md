# ADR 001 Monorepo and boundaries

Status: Accepted

## Context

Predict needs atomic contract changes across web, API, worker, database and the scientific engine.

## Decision

Use a pnpm/Turborepo monorepo. NestJS owns transactional domain and PostgreSQL access through Prisma. Python is an isolated computation service receiving immutable snapshots.

## Alternatives

Separate repositories, a Python business backend, or direct Python writes to application tables.

## Consequences

Shared change visibility improves, while the two runtimes require explicit versioned contracts and CI support.

