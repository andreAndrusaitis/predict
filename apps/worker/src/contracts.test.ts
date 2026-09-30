import { describe, expect, it } from "vitest";
import { simulationQueueName } from "./contracts";

describe("simulation queue contract", () => {
  it("uses a stable queue name", () => {
    expect(simulationQueueName).toBe("simulation-runs");
  });
});

