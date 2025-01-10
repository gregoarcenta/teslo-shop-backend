import {
  IsDecimal,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'CreateOrderDto total amount', example: '10.99' })
  @IsString()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  totalAmount: string;

  @ApiProperty({ description: 'CreateOrderDto total items', example: 2 })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  totalItems: number;
}
