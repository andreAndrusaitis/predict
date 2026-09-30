import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { TenantContextGuard } from "./identity/tenant-context.guard";
import { PermissionGuard } from "./identity/permissions";
import { PrismaService } from "./database/prisma.service";
import { SimulationRunRepository } from "./database/simulation-run.repository";
import { DecisionService } from "./decisions/decision.service";
import { DecisionController } from "./decisions/decision.controller";

@Module({ controllers: [AppController, DecisionController], providers: [PrismaService, SimulationRunRepository, DecisionService, { provide: APP_GUARD, useClass: TenantContextGuard }, { provide: APP_GUARD, useClass: PermissionGuard }] })
export class AppModule {}

