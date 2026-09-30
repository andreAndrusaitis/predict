import { OnModuleDestroy } from "@nestjs/common";
import { Queue } from "bullmq";
import { simulationQueueName } from "../../../worker/src/contracts";
import type { RunQueue } from "./simulation-run.service";

export class BullMqRunQueue implements RunQueue, OnModuleDestroy {
  private readonly queue: Queue;

  constructor(redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379") {
    const url = new URL(redisUrl);
    this.queue = new Queue(simulationQueueName, { connection: { host: url.hostname, port: Number(url.port || 6379), password: url.password || undefined } });
  }

  async enqueue(runId: string, correlationId: string): Promise<void> {
    await this.queue.add(simulationQueueName, { runId, correlationId, attempt: 1 }, { jobId: runId, removeOnComplete: 1000, removeOnFail: 1000 });
  }

  async onModuleDestroy(): Promise<void> { await this.queue.close(); }
}
