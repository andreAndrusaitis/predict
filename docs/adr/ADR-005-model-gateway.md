# ADR 005 Model Gateway

Status: Accepted

## Context

Model providers and prompts change independently of simulation state rules.

## Decision

Route AI through a provider-neutral gateway returning validated structured decisions under a recorded budget.

## Alternatives

Direct provider SDK calls in agents or free-text decisions that mutate state.

## Consequences

Providers can change behind one boundary; deterministic fallback remains available and state transitions stay testable.
