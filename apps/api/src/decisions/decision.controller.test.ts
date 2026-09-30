import { BadRequestException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { DecisionController } from "./decision.controller";

const service = { createDecision: vi.fn(), publishScenario: vi.fn() };
const request = { headers: {}, organizationId: "org-1", params: { decisionId: "00000000-0000-4000-8000-000000000001" } };

describe("DecisionController", () => {
  it("forwards validated decision input with resolved tenant", () => {
    const controller = new DecisionController(service as never);
    controller.create(request, { projectId: "00000000-0000-4000-8000-000000000001", title: "Launch policy" });
    expect(service.createDecision).toHaveBeenCalledWith("org-1", "00000000-0000-4000-8000-000000000001", "Launch policy");
  });

  it("rejects malformed external input", () => {
    expect(() => new DecisionController(service as never).create(request, { projectId: "not-a-uuid", title: "x" })).toThrow(BadRequestException);
  });
});
