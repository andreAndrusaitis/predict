import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { TenantContextGuard } from "./identity/tenant-context.guard";
import { PrismaService } from "./database/prisma.service";
import { SimulationRunRepository } from "./database/simulation-run.repository";
import { DecisionService } from "./decisions/decision.service";

@Module({ controllers: [AppController], providers: [PrismaService, SimulationRunRepository, DecisionService, { provide: APP_GUARD, useClass: TenantContextGuard }] })
export class AppModule {}

