import { Controller, Get } from '@nestjs/common';

@Controller('debug')
export class DebugController {
  @Get('ping')
  ping() {
    return { success: true, message: 'API is working!', timestamp: new Date().toISOString() };
  }
}