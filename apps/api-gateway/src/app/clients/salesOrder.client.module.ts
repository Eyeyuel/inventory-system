import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: "SALES_ORDER_SERVICE",
                useFactory: (configService: ConfigService) => {
                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [
                                configService.get("RABBITMQ_URL") || "amqp://localhost:5672",
                            ],
                            queue: configService.get("SALES_ORDERS_QUEUE") || "sales_orders_queue",
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
export class SalesOrderClientModule { }

