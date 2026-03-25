/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RpcExceptionFilter } from "./app/common/filters/rpc-exception.filters";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new RpcExceptionFilter());
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  // const port = process.env.PORT || 3001;
  const port = configService.get("PORT") || 3000;

  // swagger
  const config = new DocumentBuilder()
    .setTitle("Inventory-system")
    .setDescription("Mulit-user Inventory managment system")
    .setVersion("1.0")
    .addTag("routes")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
