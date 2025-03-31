// src/ocr/ocr.module.ts
import { Module } from '@nestjs/common';
import { VisionService } from './services/vision.service';
import { ConfigModule } from '@nestjs/config';
import { VisionController } from './controllers/vision/vision.controller';

@Module({
  imports: [ConfigModule],
  providers: [VisionService],
  controllers: [VisionController],
})
export class OcrModule {}