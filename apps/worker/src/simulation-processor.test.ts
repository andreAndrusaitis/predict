import { describe, expect, it, vi } from "vitest";
import type { SimulationEngineClient, SimulationRunRepository, StoredRun } from "./contracts";
import { processSimulationJob, UnknownSimulationRunError } from "./simulation-processor";

const job = { runId: "run-1", correlationId: "correlation-1", attempt: 1 };
function storedRun(status: StoredRun["status"] = "PENDING"): StoredRun {
  return { id: "run-1", status, snapshot: { runId: "run-1", engineVersion: "0.1.0", specificationHash: "hash", payload: { seed: 42 } } };
}
function repository(run: StoredRun | null): SimulationRunRepository {
  return { get: vi.fn().mockResolvedValue(run), markRunning: vi.fn(), markSucceeded: vi.fn(), markFailed: vi.fn(), markCancelled: vi.fn() };
}

describe("processSimulationJob", () => {
  it("persists a successful engine result", async () => {
    const store = repository(storedRun());
    const engine: SimulationEngineClient = { execute: vi.fn().mockResolvedValue({ metrics: [] }) };
    await expect(processSimulationJob(job, store, engine)).resolves.toEqual({ outcome: "succeeded" });
    expect(store.markRunning).toHaveBeenCalledWith("run-1", "correlation-1");
    expect(store.markSucceeded).toHaveBeenCalledWith("run-1", { metrics: [] });
  });

  it("does not rerun terminal work", async () => {
    const store = repository(storedRun("SUCCEEDED"));
    const engine: SimulationEngineClient = { execute: vi.fn() };
    await expect(processSimulationJob(job, store, engine)).resolves.toEqual({ outcome: "skipped" });
    expect(engine.execute).not.toHaveBeenCalled();
  });

  it("persists an engine failure before rethrowing it", async () => {
    const store = repository(storedRun());
    const engine: SimulationEngineClient = { execute: vi.fn().mockRejectedValue(new Error("unavailable")) };
    await expect(processSimulationJob(job, store, engine)).rejects.toThrow("unavailable");
    expect(store.markFailed).toHaveBeenCalledWith("run-1", { code: "SIMULATION_ENGINE_ERROR", message: "unavailable" });
  });

  it("rejects a job without an authoritative run", async () => {
    await expect(processSimulationJob(job, repository(null), { execute: vi.fn() })).rejects.toBeInstanceOf(UnknownSimulationRunError);
  });
});
