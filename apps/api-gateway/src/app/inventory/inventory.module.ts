import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule, // needed to inject ConfigService
    ClientsModule.registerAsync([
      {
        name: "INVENTORY_SERVICE",
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get("RABBITMQ_URL"); // <-- match .env
          const queue = configService.get("INVENTORY_QUEUE"); // <-- match .env

          console.log("RMQ_URL from ConfigService:", rmqUrl);
          console.log("RMQ_QUEUE from ConfigService:", queue);

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl || "amqp://localhost:5672"],
              queue: queue || "inventory_queue",
              queueOptions: { durable: false },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

////////////////////////////////////////////////////

// import { Module } from "@nestjs/common";
// import { InventoryService } from "./inventory.service";
// import { InventoryController } from "./inventory.controller";
// import { ClientsModule, Transport } from "@nestjs/microservices";

// console.log("RMQ_URL from env:", process.env.RMQ_URL);
// console.log("RMQ_QUEUE from env:", process.env.RMQ_QUEUE);

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: "INVENTORY_SERVICE",
//         transport: Transport.RMQ, // Transport.TCP
//         options: {
//           urls: [process.env.RMQ_URL || "amqp://localhost:5672"],
//           queue: process.env.RMQ_QUEUE || "inventory_queue",
//           queueOptions: {
//             durable: false,
//           },
//         },
//       },
//     ]),
//   ],
//   controllers: [InventoryController],
//   providers: [InventoryService],
// })
// export class InventoryModule {}

//////////////////////////////////////////////////////////

// import { Logger, Module } from "@nestjs/common";
// import { InventoryService } from "./inventory.service";
// import { InventoryController } from "./inventory.controller";
// import { ClientsModule, Transport } from "@nestjs/microservices";
// import { ConfigModule, ConfigService } from "@nestjs/config";

// @Module({
//   imports: [
//     ConfigModule,
//     ClientsModule.registerAsync([
//       {
//         name: "INVENTORY_SERVICE",
//         inject: [ConfigService],
//         useFactory: (configService: ConfigService) => {
//            Logger.log('RABBITMQ_URL:', configService.get('RABBITMQ_URL'));
//           return {
//           transport: Transport.RMQ,
//           url:
//             configService.get<string>("RABBITMQ_URL") ||
//             "amqp://localhost:5672",
//           queue:
//             configService.get<string>("INVENTORY_QUEUE") || "inventory_queue",
//           queueOptions: {
//             durable: false,
//           },
//         }},
//       },
//     ]),
//   ],
//   controllers: [InventoryController],
//   providers: [InventoryService],
// })
// export class InventoryModule {}
