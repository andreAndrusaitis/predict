import { createHash } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

export interface RunQueue { enqueue(runId: string, correlationId: string): Promise<void>; }
export interface StartRunInput { scenarioId: string; seed: number; idempotencyKey?: string; correlationId: string; }

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

@Injectable()
export class SimulationRunService {
  constructor(private readonly prisma: PrismaService, private readonly queue: RunQueue) {}

  async start(organizationId: string, input: StartRunInput) {
    const run = await this.prisma.$transaction(async (transaction) => {
      const scenario = await transaction.scenario.findFirst({ where: { id: input.scenarioId, decision: { project: { organizationId } } }, select: { id: true, spec: true } });
      if (!scenario) throw new NotFoundException("Scenario was not found in the organization context");
      if (input.idempotencyKey) {
        const prior = await transaction.simulationRun.findFirst({ where: { scenarioId: scenario.id, idempotencyKey: input.idempotencyKey } });
        if (prior) return { run: prior, created: false };
      }
      const specification = scenario.spec as Prisma.InputJsonValue;
      const specificationHash = createHash("sha256").update(canonicalize(specification)).digest("hex");
      const created = await transaction.simulationRun.create({ data: { scenarioId: scenario.id, seed: input.seed, engineVersion: "0.1.0", specificationHash, specification, idempotencyKey: input.idempotencyKey } });
      return { run: created, created: true };
    });
    if (run.created) await this.queue.enqueue(run.run.id, input.correlationId);
    return run.run;
  }
}
