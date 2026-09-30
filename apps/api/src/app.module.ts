import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { TenantContextGuard } from "./identity/tenant-context.guard";

@Module({ controllers: [AppController], providers: [{ provide: APP_GUARD, useClass: TenantContextGuard }] })
export class AppModule {}

