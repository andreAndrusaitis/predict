# Start simulation run

`SimulationRunService` verifies scenario ownership under the resolved organization, freezes the scenario specification into the run, generates a canonical SHA-256 hash, records seed and engine version, and enqueues only a newly created run. The `(scenarioId, idempotencyKey)` constraint lets retried clients receive the original run rather than scheduling duplicate computation.

`BullMqRunQueue` transports only the run and correlation IDs; it uses `runId` as BullMQ `jobId` to make duplicate delivery safe.
