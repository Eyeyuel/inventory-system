/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      url: configService.get<string>("RABBITMQ_URL") || "amqp://localhost:5672",
      queue: configService.get<string>("USERS_QUEUE") || "users_queue",
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();
  Logger.log(`🚀 user Application is running using RMQ`);
}

bootstrap();
