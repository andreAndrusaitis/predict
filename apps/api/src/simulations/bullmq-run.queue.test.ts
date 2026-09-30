import { describe, expect, it, vi } from "vitest";
import { BullMqRunQueue } from "./bullmq-run.queue";

vi.mock("bullmq", () => ({ Queue: class { add = vi.fn(); close = vi.fn(); } }));

describe("BullMqRunQueue", () => {
  it("uses the durable run id as the BullMQ job id", async () => {
    const queue = new BullMqRunQueue("redis://localhost:6379");
    await queue.enqueue("run-1", "trace-1");
    const internal = queue as unknown as { queue: { add: ReturnType<typeof vi.fn> } };
    expect(internal.queue.add).toHaveBeenCalledWith("simulation-runs", { runId: "run-1", correlationId: "trace-1", attempt: 1 }, expect.objectContaining({ jobId: "run-1" }));
  });
});
