import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { ...dto },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    await this.prisma.category.delete({
      where: { id },
    });
    return { success: true };
  }
}
