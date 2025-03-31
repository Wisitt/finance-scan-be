import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTransactionDto } from './dtos';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(dto: CreateTransactionDto) {
    try {
      this.logger.log(`TransactionsService.create - Received DTO: ${JSON.stringify(dto, null, 2)}`);

      if (typeof dto.date === 'string') {
        dto.date = new Date(dto.date).toISOString();
      }
      dto.created_at = new Date().toISOString();

      this.logger.log(`TransactionsService.create - Data before Prisma: ${JSON.stringify(dto, null, 2)}`);

      const createdTransaction = await this.prisma.transaction.create({
        data: {
          user_id: dto.user_id,
          amount: dto.amount,
          type: dto.type,
          category: dto.category,
          date: dto.date,
          description: dto.description,
          receipt_images: dto.receipt_images,
          created_at: dto.created_at,
        },
      });
      

      this.logger.log(`TransactionsService.create - Prisma response: ${JSON.stringify(createdTransaction, null, 2)}`);

      return createdTransaction;
    } catch (error) {
      this.logger.error(`TransactionsService.create - Error: ${error}`);
      throw error;
    }
  }
  
  

  async remove(id: string, userId: string) {
    await this.prisma.transaction.deleteMany({
      where: { id, user_id: userId },
    });
    return { success: true };
  }
}
