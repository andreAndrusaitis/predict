import { describe, expect, it, vi } from "vitest";
import { CorrelationIdMiddleware } from "./correlation-id.middleware";
describe("CorrelationIdMiddleware", () => {
  it("preserves an incoming correlation id", () => { const request: { headers: Record<string, string>; correlationId?: string } = { headers: { "x-correlation-id": "trace-1" } }; const setHeader = vi.fn(); new CorrelationIdMiddleware().use(request, { setHeader }, vi.fn()); expect(request.correlationId).toBe("trace-1"); expect(setHeader).toHaveBeenCalledWith("x-correlation-id", "trace-1"); });
});
