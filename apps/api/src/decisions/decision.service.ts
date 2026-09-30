import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class DecisionService {
  constructor(private readonly prisma: PrismaService) {}

  async createDecision(organizationId: string, projectId: string, title: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, organizationId }, select: { id: true } });
    if (!project) throw new ForbiddenException("Project is outside the organization context");
    return this.prisma.decision.create({ data: { projectId: project.id, title } });
  }

  async publishScenario(organizationId: string, decisionId: string, specification: Prisma.InputJsonValue) {
    return this.prisma.$transaction(async (transaction) => {
      const decision = await transaction.decision.findFirst({ where: { id: decisionId, project: { organizationId } }, select: { id: true } });
      if (!decision) throw new NotFoundException("Decision was not found in the organization context");
      const latest = await transaction.scenario.aggregate({ where: { decisionId }, _max: { version: true } });
      const version = (latest._max.version ?? 0) + 1;
      try {
        return await transaction.scenario.create({ data: { decisionId, version, spec: specification } });
      } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") throw new ConflictException("Scenario version conflict; retry publication");
        throw error;
      }
    });
  }
}
