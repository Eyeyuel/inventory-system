import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: "PURCHASE_ORDER_SERVICE",
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ, // Transport.TCP
                    options: {
                        url:
                            configService.get<string>("RABBITMQ_URL") ||
                            "amqp://localhost:5672",
                        queue: configService.get<string>("PURCHASE_ORDERS_QUEUE") || "purchase_orders_queue",
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
export class PurchaseOrderClientModule { }
