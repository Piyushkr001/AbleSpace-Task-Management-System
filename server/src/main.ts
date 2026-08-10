import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set global API prefix
  app.setGlobalPrefix("api");

  // Configure Cookie Parser
  app.use(cookieParser());

  // Enable CORS
  const clientUrl = configService.get<string>("CLIENT_URL", "http://localhost:3000");
  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const port = configService.get<number>("PORT", 5001);
  await app.listen(port);
  console.log(`Taskora backend listening on port ${port} at /api`);
}

bootstrap();
