import { ForbiddenException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { DecisionService } from "./decision.service";

describe("DecisionService", () => {
  it("does not create a decision for a project outside tenant scope", async () => {
    const prisma = { project: { findFirst: vi.fn().mockResolvedValue(null) } };
    await expect(new DecisionService(prisma as never).createDecision("org-a", "project-b", "Launch")).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("publishes the next immutable scenario version", async () => {
    const create = vi.fn().mockResolvedValue({ id: "scenario-2", version: 2 });
    const transaction = { decision: { findFirst: vi.fn().mockResolvedValue({ id: "decision-1" }) }, scenario: { aggregate: vi.fn().mockResolvedValue({ _max: { version: 1 } }), create } };
    const prisma = { $transaction: (callback: (client: typeof transaction) => unknown) => callback(transaction) };
    await expect(new DecisionService(prisma as never).publishScenario("org-a", "decision-1", { horizon: 10 })).resolves.toEqual({ id: "scenario-2", version: 2 });
    expect(create).toHaveBeenCalledWith({ data: { decisionId: "decision-1", version: 2, spec: { horizon: 10 } } });
  });
});
