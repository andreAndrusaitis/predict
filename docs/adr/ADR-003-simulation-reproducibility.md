# ADR 003 Simulation reproducibility

Status: Accepted

## Context

Simulation outputs must be auditable and comparable.

## Decision

Persist immutable scenario/population snapshots, seed, engine/model/prompt versions, canonical specification hash and structured model outputs. Derive all deterministic random streams from the run seed.

## Alternatives

Mutable drafts, global random state, or replaying live model calls only.

## Consequences

Storage increases, but exact deterministic replay and drift comparisons become possible.

