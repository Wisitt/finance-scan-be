import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users?email=xxx
  @Get()
  async findAllOrByEmail(@Query('email') email?: string) {
    if (email) {
      const user = await this.usersService.findByEmail(email);
      return user || null; // 👈 คืนค่า null แต่ status ยังเป็น 200
    }
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // POST /users
  @Post()
  async create(@Body() dto: CreateUserDto) {
    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }
    return this.usersService.create(dto);
  }
  

  // PUT /users/:id
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // DELETE /users/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
