import * as dotenv from 'dotenv';
dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT) || 8080;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  Logger.log(`✅ ENV Loaded`);
  Logger.log(`🌐 FRONTEND_URL = ${frontendUrl}`, 'Bootstrap');
  Logger.log(`🚀 App starting on port ${port}`, 'Bootstrap');

  // Important: Must bind to 0.0.0.0 for Cloud Run
  await app.listen(port, '0.0.0.0');
}
bootstrap();
