export interface SimulationJob { runId: string; correlationId: string; attempt: number; }
export const simulationQueueName = "simulation-runs";

