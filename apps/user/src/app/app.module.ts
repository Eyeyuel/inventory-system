import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("POSTGRES_HOST") ?? "localhost",
        port: +(config.get<string>("POSTGRES_PORT") ?? "5432"),
        username: config.get<string>("POSTGRES_USER") ?? "postgres",
        password: config.get<string>("POSTGRES_PASSWORD") ?? "1234",
        database: config.get<string>("POSTGRES_DATABASE") ?? "user_db",
        // entities: [__dirname + "/**/*.entity{.ts,.js}"],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
