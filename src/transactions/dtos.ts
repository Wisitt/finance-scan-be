import { IsString, IsNumber, IsOptional, IsArray, IsISO8601 } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  type: string;

  @IsString()
  category: string;

  @IsISO8601()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  receipt_images?: string[];

  @IsOptional()
  @IsISO8601()
  created_at?: string;
}
