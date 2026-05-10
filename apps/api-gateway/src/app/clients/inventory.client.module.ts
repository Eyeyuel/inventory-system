import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: "INVENTORY_SERVICE",
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                configService.get("RABBITMQ_URL") || "amqp://localhost:5672",
              ],
              queue: configService.get("INVENTORY_QUEUE") || "inventory_queue",
              queueOptions: { durable: false },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class InventoryClientModule {}
