import type { OrganizationRole } from "./roles";
export interface OrganizationMembership { organizationId: string; role: OrganizationRole; }
export interface RequestPrincipal { userId: string; email: string; memberships: OrganizationMembership[]; }
export interface AuthenticatedRequest { headers: Record<string, string | string[] | undefined>; params?: Record<string, string | undefined>; principal?: RequestPrincipal; organizationId?: string; }
