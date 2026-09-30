import { describe, expect, it, vi } from "vitest";
import { SimulationRunService } from "./simulation-run.service";

describe("SimulationRunService", () => {
  it("creates one hashed snapshot and enqueues it", async () => {
    const created = { id: "run-1", scenarioId: "scenario-1" };
    const transaction = { scenario: { findFirst: vi.fn().mockResolvedValue({ id: "scenario-1", spec: { rounds: 10, seedPolicy: "fixed" } }) }, simulationRun: { findFirst: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue(created) } };
    const prisma = { $transaction: (callback: (client: typeof transaction) => unknown) => callback(transaction) };
    const queue = { enqueue: vi.fn() };
    const result = await new SimulationRunService(prisma as never, queue).start("org-1", { scenarioId: "scenario-1", seed: 42, idempotencyKey: "request-1", correlationId: "trace-1" });
    expect(result).toEqual(created);
    expect(transaction.simulationRun.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ seed: 42, specificationHash: expect.any(String) }) }));
    expect(queue.enqueue).toHaveBeenCalledWith("run-1", "trace-1");
  });

  it("returns an idempotent prior run without enqueueing", async () => {
    const existing = { id: "run-existing" };
    const transaction = { scenario: { findFirst: vi.fn().mockResolvedValue({ id: "scenario-1", spec: {} }) }, simulationRun: { findFirst: vi.fn().mockResolvedValue(existing), create: vi.fn() } };
    const prisma = { $transaction: (callback: (client: typeof transaction) => unknown) => callback(transaction) };
    const queue = { enqueue: vi.fn() };
    await expect(new SimulationRunService(prisma as never, queue).start("org-1", { scenarioId: "scenario-1", seed: 42, idempotencyKey: "request-1", correlationId: "trace-1" })).resolves.toEqual(existing);
    expect(queue.enqueue).not.toHaveBeenCalled();
  });
});
