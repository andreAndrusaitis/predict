import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { TenantContextGuard } from "./identity/tenant-context.guard";
import { PermissionGuard } from "./identity/permissions";
import { PrismaService } from "./database/prisma.service";
import { SimulationRunRepository } from "./database/simulation-run.repository";
import { DecisionService } from "./decisions/decision.service";
import { DecisionController } from "./decisions/decision.controller";
import { BullMqRunQueue } from "./simulations/bullmq-run.queue";
import { RUN_QUEUE, SimulationRunService } from "./simulations/simulation-run.service";
import { CorrelationIdMiddleware } from "./observability/correlation-id.middleware";

@Module({ controllers: [AppController, DecisionController], providers: [PrismaService, SimulationRunRepository, DecisionService, SimulationRunService, { provide: RUN_QUEUE, useClass: BullMqRunQueue }, { provide: APP_GUARD, useClass: TenantContextGuard }, { provide: APP_GUARD, useClass: PermissionGuard }] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void { consumer.apply(CorrelationIdMiddleware).forRoutes("*"); }
}

