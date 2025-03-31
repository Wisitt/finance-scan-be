import { Controller, Get, Post, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(@Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId is required' };
    }
    return this.transactionsService.findAllByUser(userId);
  }

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    if (!dto.user_id) {
      throw new BadRequestException('user_id is required');
    }
    return this.transactionsService.create(dto);
  }
  

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId is required' };
    }
    return this.transactionsService.remove(id, userId);
  }
}
