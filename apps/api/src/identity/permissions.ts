import { CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AuthenticatedRequest } from "./principal";
import { type Permission, roleGrants } from "./roles";

export const REQUIRED_PERMISSION = "predict:required-permission";
export const RequirePermission = (permission: Permission) => SetMetadata(REQUIRED_PERMISSION, permission);

export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<Permission | undefined>(REQUIRED_PERMISSION, [context.getHandler(), context.getClass()]);
    if (!permission) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const membership = request.principal?.memberships.find((item) => item.organizationId === request.organizationId);
    if (!membership || !roleGrants(membership.role, permission)) throw new ForbiddenException("Insufficient permission for organization context");
    return true;
  }
}
