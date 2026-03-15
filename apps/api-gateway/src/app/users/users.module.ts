import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
