import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; 
  const port = parseInt(process.env.PORT || '3001', 10);
  dotenv.config();
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  Logger.log(`CORS enabled for origin: ${frontendUrl}`, 'Bootstrap');
  Logger.log('Global ValidationPipe enabled', 'Bootstrap');


  await app.listen(port);
  Logger.log(`NestJS application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();