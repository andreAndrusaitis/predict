import { BadRequestException, Body, Controller, Post, Req } from "@nestjs/common";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { RequirePermission } from "../identity/permissions";
import type { AuthenticatedRequest } from "../identity/principal";
import { DecisionService } from "./decision.service";

const createDecisionSchema = z.object({ projectId: z.string().uuid(), title: z.string().trim().min(3).max(180) });
const jsonValue: z.ZodType<Prisma.JsonValue> = z.lazy(() => z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonValue), z.record(jsonValue)]));
const publishScenarioSchema = z.object({ specification: z.record(jsonValue) });

function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new BadRequestException({ code: "VALIDATION_ERROR", issues: result.error.flatten() });
  return result.data;
}

@Controller("decisions")
export class DecisionController {
  constructor(private readonly decisions: DecisionService) {}

  @Post()
  @RequirePermission("decision:write")
  create(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const { projectId, title } = parse(createDecisionSchema, body);
    return this.decisions.createDecision(this.organizationId(request), projectId, title);
  }

  @Post(":decisionId/scenarios")
  @RequirePermission("decision:write")
  publishScenario(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const { specification } = parse(publishScenarioSchema, body);
    return this.decisions.publishScenario(this.organizationId(request), request.params?.decisionId ?? "", specification as Prisma.InputJsonObject);
  }

  private organizationId(request: AuthenticatedRequest): string {
    if (!request.organizationId) throw new BadRequestException("Organization context was not resolved");
    return request.organizationId;
  }
}
