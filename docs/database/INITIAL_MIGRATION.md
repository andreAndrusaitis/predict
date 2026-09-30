# Initial Migration Review

`202609290001_initial_domain` creates the transaction-domain ownership chain: user, organization, membership, project, decision, immutable scenario version and simulation run metadata. It enables pgvector but intentionally does not add a vector column until semantic-memory dimensions and retention contract are stable.

The migration is forward-only. In a production change, destructive rollback is not automatic; an expand/contract migration and verified backup are required. It has not been applied locally because the Docker daemon is unavailable in this environment.

