import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { RpcExceptionFilter } from './app/common/filters/rpc-exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws a BadRequestException if extra fields are sent
      transform: true, // automatically transforms payload to DTO instances
      transformOptions: { enableImplicitConversion: true }, // This handles the Type automatically
    }),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new RpcExceptionFilter());
  // app.use(cookieParser());

  const configService = app.get(ConfigService);
  // const port = process.env.PORT || 3001;
  const port = configService.get('PORT') || 3000;

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Inventory-system')
    .setDescription('Mulit-user Inventory managment system')
    .setVersion('1.0')
    .addTag('routes')
    .addBearerAuth()
    .build();

  // const options: SwaggerCustomOptions = {
  //   ui: false, // Swagger UI is disabled
  //   raw: ['yaml', 'json'],
  // };
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
