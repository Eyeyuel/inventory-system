import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: "USERS_SERVICE",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ, // Transport.TCP
          options: {
            url:
              configService.get<string>("RABBITMQ_URL") ||
              "amqp://localhost:5672",
            queue: configService.get<string>("USERS_QUEUE") || "users_queue",
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class UserClientModule {}
