# Decisions and immutable scenarios

`DecisionService` takes the organization context resolved by the request boundary. It verifies project ownership before decision creation. Scenario publication runs in one transaction, derives the next version and relies on the unique `(decisionId, version)` constraint to prevent competing writes from silently overwriting a published specification.

The public REST contract is `POST /v1/decisions` and `POST /v1/decisions/:decisionId/scenarios`. Both require `decision:write`, resolve tenant scope before reaching the controller and validate payloads with Zod.
