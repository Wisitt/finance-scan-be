import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.upsert({
      where: { email: dto.email },
      update: {
        name: dto.name,
        avatar_url: dto.avatar_url,
        google_id: dto.google_id,
        last_login: dto.last_login ? new Date(dto.last_login) : new Date(),
      },
      create: {
        name: dto.name,
        email: dto.email,
        avatar_url: dto.avatar_url,
        google_id: dto.google_id,
        last_login: dto.last_login ? new Date(dto.last_login) : new Date(),
        created_at: new Date(),
      },
    });
  }
  

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return { success: true };
  }
}
