// src/ocr/controllers/vision.controller.ts
import {
    Controller, Post, Body, HttpCode, HttpStatus,
    UsePipes, ValidationPipe, Logger, HttpException
  } from '@nestjs/common';
  import { IsNotEmpty, IsUrl } from 'class-validator';
import { ParsedOcrResult } from 'src/ocr/dtos';
import { VisionService } from 'src/ocr/services/vision.service';
  
  // DTO สำหรับ Request Body
  export class ProcessImageDto {
    @IsNotEmpty({ message: 'imageUrl is required' })
    @IsUrl({}, { message: 'imageUrl must be a valid URL' })
    imageUrl: string;
  }
  
  @Controller('ocr') // Base path: /ocr
  export class VisionController {
    private readonly logger = new Logger(VisionController.name);
  
    constructor(private readonly visionService: VisionService) {}
  
    @Post('google-vision') // Full path: /ocr/google-vision
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async processReceipt(@Body() processImageDto: ProcessImageDto): Promise<ParsedOcrResult> {
      this.logger.log(`Received request to process image via Google Vision: ${processImageDto.imageUrl}`);
      try {
        const result = await this.visionService.processImageFromUrl(processImageDto.imageUrl);
        return result;
      } catch (error) {
        this.logger.error(`Error in processReceipt endpoint: ${error.message}`, error.stack);
        // Throw appropriate HttpException
        throw new HttpException(
            error.message || 'Failed to process image using Vision API',
            HttpStatus.INTERNAL_SERVER_ERROR, // Or a more specific code
        );
      }
    }
  }