# Prisma persistence boundary

The NestJS API owns the Prisma client. Frontend and Python engine never receive `DATABASE_URL` or import Prisma. A `SimulationRun` stores an immutable JSON execution specification plus its canonical hash, seed and engine version. The additive second migration preserves existing migration history.

`SimulationRunRepository` is the only current adapter that translates lifecycle persistence to Prisma. It establishes the eventual worker integration boundary without allowing the worker or engine direct database access.
