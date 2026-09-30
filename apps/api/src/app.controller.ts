import { Controller, Get } from "@nestjs/common";
import { PublicRoute } from "./identity/public-route";

@Controller("v1")
export class AppController {
  @Get("health")
  @PublicRoute()
  health() { return { status: "ok", service: "predict-api" }; }
}

