-- Immutable execution input retained independently of the mutable scenario draft.
ALTER TABLE "SimulationRun" ADD COLUMN "specification" JSONB NOT NULL DEFAULT '{}';
