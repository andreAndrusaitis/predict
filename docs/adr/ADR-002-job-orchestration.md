# ADR 002 Job orchestration

Status: Accepted

## Context

The product specification mentioned Celery, while the approved technical baseline selected Redis/BullMQ and a Node worker alongside NestJS.

## Decision

Use BullMQ/Redis for MVP job lifecycle; call the Python engine through an internal contract.

## Alternatives

Celery as primary queue or direct HTTP execution within a request.

## Consequences

The API remains non-blocking and transactional ownership stays in TypeScript. Re-evaluate if the engine needs independent distributed work consumption.

