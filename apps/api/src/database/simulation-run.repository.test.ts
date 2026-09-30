import { describe, expect, it, vi } from "vitest";
import { SimulationRunRepository } from "./simulation-run.repository";

describe("SimulationRunRepository", () => {
  it("marks a run as terminal with a persisted result", async () => {
    const update = vi.fn().mockResolvedValue({});
    const repository = new SimulationRunRepository({ simulationRun: { update } } as never);
    await repository.markSucceeded("run-1", { metrics: [] });
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "run-1" }, data: expect.objectContaining({ status: "SUCCEEDED", result: { metrics: [] } }) }));
  });
});
