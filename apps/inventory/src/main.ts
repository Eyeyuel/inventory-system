/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from "@nestjs/common";
// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app/app.module";
// import { MicroserviceOptions, Transport } from "@nestjs/microservices";

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.RMQ,
//       options: {
//         urls: [process.env.RMQ_URL || "amqp://localhost:5672"],
//         queue: process.env.RMQ_QUEUE || "inventory_queue",
//         queueOptions: {
//           durable: false,
//         },
//       },
//     },
//   );
//   // const globalPrefix = 'api';
//   // app.setGlobalPrefix(globalPrefix);
//   // const port = process.env.PORT || 3000;
//   await app.listen();
//   Logger.log(`🚀 inventory service is running on RMQ`);
// }

// bootstrap();

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      url: configService.get<string>("RABBITMQ_URL") || "amqp://localhost:5672",
      queue: configService.get<string>("INVENTORY_QUEUE") || "inventory_queue",
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  Logger.log(`🚀 inventory service is running on RMQ`);
}
bootstrap();
