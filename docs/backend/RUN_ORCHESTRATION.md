# Simulation run orchestration

The queue message contains only `runId`, `correlationId` and attempt metadata. `processSimulationJob` loads authoritative status and the immutable snapshot from the repository, making a completed or cancelled delivery idempotent. It persists terminal outcomes and rethrows engine failures so BullMQ can apply its retry policy. A future Prisma repository and HTTP engine adapter will implement the interfaces without changing the orchestration rule.
