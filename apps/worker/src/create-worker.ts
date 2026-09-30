import { Worker } from "bullmq";
import { type SimulationEngineClient, type SimulationJob, type SimulationRunRepository, simulationQueueName } from "./contracts";
import { processSimulationJob } from "./simulation-processor";

export function createSimulationWorker(repository: SimulationRunRepository, engine: SimulationEngineClient, redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379"): Worker<SimulationJob> {
  const url = new URL(redisUrl);
  return new Worker<SimulationJob>(simulationQueueName, (job) => processSimulationJob(job.data, repository, engine), {
    connection: { host: url.hostname, port: Number(url.port || 6379), password: url.password || undefined },
    concurrency: 2,
  });
}
