# Identity and tenant boundary

Every protected request needs an authenticated principal from the future OIDC adapter and an explicit `x-organization-id`. `TenantContextGuard` verifies membership before attaching the resolved organization to the request; domain queries must use that resolved scope, never a client-supplied body field. Token parsing is deliberately not replaced by a client-controlled header.
