import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { TenantContextGuard } from "./tenant-context.guard";
import type { AuthenticatedRequest } from "./principal";
function context(request: object) { return { getHandler: () => undefined, getClass: () => undefined, switchToHttp: () => ({ getRequest: () => request }) } as never; }
const reflector = { getAllAndOverride: () => false } as never;
describe("TenantContextGuard", () => {
  it("resolves a tenant only when the principal is a member", () => { const request: AuthenticatedRequest = { headers: { "x-organization-id": "org-a" }, principal: { userId: "u", email: "a@predict.dev", memberships: [{ organizationId: "org-a", role: "MODELER" }] } }; expect(new TenantContextGuard(reflector).canActivate(context(request))).toBe(true); expect(request.organizationId).toBe("org-a"); });
  it("rejects a missing principal", () => { expect(() => new TenantContextGuard(reflector).canActivate(context({ headers: {} }))).toThrow(UnauthorizedException); });
  it("rejects a cross-tenant context", () => { const request = { headers: { "x-organization-id": "org-b" }, principal: { userId: "u", email: "a@predict.dev", memberships: [{ organizationId: "org-a", role: "VIEWER" as const }] } }; expect(() => new TenantContextGuard(reflector).canActivate(context(request))).toThrow(ForbiddenException); });
});
