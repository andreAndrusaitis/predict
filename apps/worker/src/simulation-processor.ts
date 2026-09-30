import type { SimulationEngineClient, SimulationJob, SimulationRunRepository } from "./contracts";

export class UnknownSimulationRunError extends Error {
  constructor(runId: string) { super(`Simulation run ${runId} was not found`); }
}

/**
 * Executes one durable run. Replaying a completed or cancelled job has no side effect,
 * which lets BullMQ retry only transient delivery/engine failures safely.
 */
export async function processSimulationJob(
  job: SimulationJob,
  repository: SimulationRunRepository,
  engine: SimulationEngineClient,
): Promise<{ outcome: "succeeded" | "skipped" | "cancelled" }> {
  const run = await repository.get(job.runId);
  if (!run) throw new UnknownSimulationRunError(job.runId);
  if (run.status === "SUCCEEDED" || run.status === "CANCELLED") return { outcome: "skipped" };
  if (run.status === "CANCEL_REQUESTED") {
    await repository.markCancelled(run.id);
    return { outcome: "cancelled" };
  }

  await repository.markRunning(run.id, job.correlationId);
  try {
    const result = await engine.execute(run.snapshot, job.correlationId);
    await repository.markSucceeded(run.id, result);
    return { outcome: "succeeded" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown engine error";
    await repository.markFailed(run.id, { code: "SIMULATION_ENGINE_ERROR", message });
    throw error;
  }
}
