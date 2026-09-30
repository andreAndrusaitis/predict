ALTER TABLE "SimulationRun" ADD COLUMN "idempotencyKey" TEXT;
CREATE UNIQUE INDEX "SimulationRun_scenarioId_idempotencyKey_key" ON "SimulationRun"("scenarioId", "idempotencyKey");
