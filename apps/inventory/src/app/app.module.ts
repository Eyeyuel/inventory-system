import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { StockModule } from './stock/stock.module';
import { StockMovementModule } from './stockMovement/stock-movement.module';
import { LocationModule } from './location/location.module';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule], // Import ConfigModule to make ConfigService available
      inject: [ConfigService], // Inject ConfigService into the factory function
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        return {
          stores: [new KeyvRedis(redisUrl)],
          ttl: 60_000, // TTL in milliseconds (e.g., 60 seconds)
        };
      },
    }),
    // CacheModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     store: new KeyvRedis(configService.get<string>('REDIS_URL') || 'redis://localhost:6379'),
    //     // ttl: 60_000, // optional
    //   }),
    //   isGlobal: true,
    // }),
    DatabaseModule,
    CategoryModule,
    StockModule,
    StockMovementModule,
    LocationModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
