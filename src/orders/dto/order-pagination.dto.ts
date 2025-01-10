import { OrderStatus } from '../enums/order-status';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderPaginationDto {
  @ApiPropertyOptional({ description: 'Limit page', example: '5' })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset page', example: '0' })
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Order status',
    example: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
