import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { ProfileModule } from './profile/profile.module';
import { LocationModule } from './location/location.module';
import { StockModule } from './stock/stock.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { PurchaseModule } from './purchase/purchase.module';
import { SalesModule } from './sales/sales.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // signOptions: { expiresIn: "1h" },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'strict', // for writes: create, update, delete
        ttl: 1000,
        limit: 5,
      },
      {
        name: 'moderate', // for read-heavy but sensitive (e.g., user profile)
        ttl: 10000,
        limit: 30,
      },
      {
        name: 'relaxed', // for public GETs, search, listing
        ttl: 60000,
        limit: 200,
      },
    ]),
    UsersModule,
    ProductModule,
    CategoryModule,
    ProfileModule,
    LocationModule,
    StockModule,
    PurchaseModule,
    SalesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
