import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "node:crypto";

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: { headers: Record<string, string | string[] | undefined>; correlationId?: string }, response: { setHeader(name: string, value: string): void }, next: () => void): void {
    const incoming = request.headers["x-correlation-id"];
    const correlationId = typeof incoming === "string" && incoming.length <= 128 ? incoming : randomUUID();
    request.correlationId = correlationId;
    response.setHeader("x-correlation-id", correlationId);
    next();
  }
}
