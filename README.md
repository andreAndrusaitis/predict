# Predict

Predict is a decision-intelligence platform for comparing simulated scenarios with synthetic populations. It combines deterministic agent-based modelling, social networks, controlled randomness and optional structured AI reasoning. A simulated frequency is not represented as a real-world probability unless the model is calibrated for that use.

## Architecture

- `apps/web`: Next.js product interface.
- `apps/api`: NestJS transactional API and public domain boundary.
- `apps/worker`: BullMQ orchestration boundary.
- `services/simulation-engine`: Python scientific computation service.
- `packages`: shared contracts and configuration.
- `prisma`: PostgreSQL schema and migrations.

## Local development

1. Copy `.env.example` to `.env`.
2. Run `docker compose up --build`.
3. Run engine tests with `python -m unittest discover services/simulation-engine/tests`.

Detailed engineering plan: `docs/planning/MASTER_PLAN.md`.

