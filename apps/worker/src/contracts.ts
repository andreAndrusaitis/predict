export interface SimulationJob { runId: string; correlationId: string; attempt: number; }
export const simulationQueueName = "simulation-runs";

export type PersistedRunStatus = "PENDING" | "RUNNING" | "CANCEL_REQUESTED" | "SUCCEEDED" | "FAILED" | "CANCELLED";

export interface RunSnapshot {
  runId: string;
  specificationHash: string;
  engineVersion: string;
  payload: unknown;
}

export interface StoredRun {
  id: string;
  status: PersistedRunStatus;
  snapshot: RunSnapshot;
}

export interface SimulationRunRepository {
  get(runId: string): Promise<StoredRun | null>;
  markRunning(runId: string, correlationId: string): Promise<void>;
  markSucceeded(runId: string, result: unknown): Promise<void>;
  markFailed(runId: string, error: { code: string; message: string }): Promise<void>;
  markCancelled(runId: string): Promise<void>;
}

export interface SimulationEngineClient {
  execute(snapshot: RunSnapshot, correlationId: string): Promise<unknown>;
}

