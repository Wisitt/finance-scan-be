import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8080;
  const frontendUrl = process.env.FRONTEND_URL || `http://localhost:3000`;

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  Logger.log(`CORS enabled for origin: ${frontendUrl}`, 'Bootstrap');
  Logger.log(`App listening on port ${port}`, 'Bootstrap');

  await app.listen(port);
}
bootstrap();
