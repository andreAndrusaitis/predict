export const organizationRoles = ["OWNER", "ADMIN", "MODELER", "REVIEWER", "VIEWER"] as const;
export type OrganizationRole = (typeof organizationRoles)[number];
export type Permission = "organization:read" | "project:write" | "decision:write" | "simulation:run" | "audit:read";
const permissionsByRole: Record<OrganizationRole, readonly Permission[]> = {
  OWNER: ["organization:read", "project:write", "decision:write", "simulation:run", "audit:read"], ADMIN: ["organization:read", "project:write", "decision:write", "simulation:run", "audit:read"], MODELER: ["organization:read", "project:write", "decision:write", "simulation:run"], REVIEWER: ["organization:read", "audit:read"], VIEWER: ["organization:read"],
};
export function roleGrants(role: OrganizationRole, permission: Permission): boolean { return permissionsByRole[role].includes(permission); }
