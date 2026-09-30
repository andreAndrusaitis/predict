# ADR 004 Prisma PostgreSQL

Status: Accepted

## Context

The transactional domain requires migrations, tenant-scoped relations and auditable lifecycle data.

## Decision

Use PostgreSQL as source of truth and Prisma as the API-owned persistence boundary. SQL is restricted to reviewed migrations and specialized vector work.

## Alternatives

Direct ORM access from every service or Redis as primary storage.

## Consequences

Migrations are versioned and the worker/engine access state through contracts rather than direct queries.
