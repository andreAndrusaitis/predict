import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("v1", { exclude: ["v1/health"] });
  await app.listen(process.env.API_PORT ?? 3001);
}
void bootstrap();

