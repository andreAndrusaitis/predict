import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";

export interface PersistedSimulationRun {
  id: string;
  status: string;
  seed: number;
  engineVersion: string;
  specificationHash: string;
  specification: Prisma.JsonValue;
}

@Injectable()
export class SimulationRunRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<PersistedSimulationRun | null> {
    return this.prisma.simulationRun.findUnique({
      where: { id },
      select: { id: true, status: true, seed: true, engineVersion: true, specificationHash: true, specification: true },
    });
  }

  async markRunning(id: string): Promise<void> {
    await this.prisma.simulationRun.update({ where: { id }, data: { status: "RUNNING", startedAt: new Date() } });
  }

  async markSucceeded(id: string, result: Prisma.InputJsonValue): Promise<void> {
    await this.prisma.simulationRun.update({ where: { id }, data: { status: "SUCCEEDED", result, finishedAt: new Date() } });
  }

  async markFailed(id: string, error: Prisma.InputJsonValue): Promise<void> {
    await this.prisma.simulationRun.update({ where: { id }, data: { status: "FAILED", result: { error }, finishedAt: new Date() } });
  }
}
