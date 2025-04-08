import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  dotenv.config();
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  Logger.log(`CORS enabled for origin: ${frontendUrl}`, 'Bootstrap');
  Logger.log('Global ValidationPipe enabled', 'Bootstrap');


  await app.listen(process.env.PORT || 3000);
}
bootstrap();