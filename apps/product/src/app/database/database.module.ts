import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRES_HOST") ?? "localhost",
        port: +(configService.get<number>("POSTGRES_PORT") ?? "5432"),
        username: configService.get<string>("POSTGRES_USER") ?? "postgres",
        password: configService.get<string>("POSTGRES_PASSWORD") ?? "1234",
        database:
          configService.get<string>("POSTGRES_DATABASE") ?? "product_db",
        // entities: ['dist/**/*.entity.js'],
        synchronize: true,
        autholoadEntities: true,
      }),
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
