import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: "PRODUCT_SERVICE",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ, // Transport.TCP
          options: {
            url:
              configService.get<string>("RABBITMQ_URL") ||
              "amqp://localhost:5672",
            queue:
              configService.get<string>("PRODUCT_QUEUE") || "product_queue",
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
