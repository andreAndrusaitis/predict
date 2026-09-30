import { describe, expect, it, vi } from "vitest";
const worker = vi.fn();
vi.mock("bullmq", () => ({ Worker: worker }));
import { createSimulationWorker } from "./create-worker";
describe("createSimulationWorker", () => {
  it("configures bounded concurrency", () => {
    createSimulationWorker({} as never, {} as never, "redis://localhost:6380");
    expect(worker).toHaveBeenCalledWith("simulation-runs", expect.any(Function), expect.objectContaining({ concurrency: 2, connection: expect.objectContaining({ port: 6380 }) }));
  });
});
