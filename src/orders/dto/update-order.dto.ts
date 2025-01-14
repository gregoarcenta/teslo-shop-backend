import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status';
import { IsBoolean, IsDate, IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Order status',
    example: OrderStatus.PENDING,
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Order paid',
    example: true,
  })
  @IsBoolean()
  paid?: boolean;

  @ApiPropertyOptional({
    description: 'Order paid at',
    example: '2025-01-11 19:35:28.059694',
  })
  @IsDate()
  paidAt?: Date;
}
