import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AuthenticatedRequest } from "./principal";
import { IS_PUBLIC_ROUTE } from "./public-route";
function headerValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/** Resolves and validates tenant scope before a domain handler is invoked. */
export class TenantContextGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [context.getHandler(), context.getClass()])) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.principal) throw new UnauthorizedException("Authenticated principal is required");
    const organizationId = headerValue(request.headers["x-organization-id"]);
    if (!organizationId) throw new ForbiddenException("Organization context is required");
    if (!request.principal.memberships.some((membership) => membership.organizationId === organizationId)) throw new ForbiddenException("Principal is not a member of this organization");
    request.organizationId = organizationId;
    return true;
  }
}
