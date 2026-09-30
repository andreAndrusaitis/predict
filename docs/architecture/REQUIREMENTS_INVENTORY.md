# Requirements Inventory and Resolution

The two source documents agree on a hybrid ABM architecture: deterministic kernel, typed agent state, versioned inputs, social graphs, Monte Carlo, strict AI contracts and multi-tenant governance. They agree the product must communicate uncertainty and cannot present uncalibrated outputs as real-world prediction.

One implementation divergence exists: the earlier product document proposes a Python/FastAPI backend with Celery; the later technical baseline explicitly assigns transactional ownership to NestJS/Prisma and job orchestration to BullMQ/Redis. The later baseline is more detailed about product boundaries and is adopted. Python/FastAPI remains the internal scientific engine. This is recorded in ADR-001 and ADR-002.

