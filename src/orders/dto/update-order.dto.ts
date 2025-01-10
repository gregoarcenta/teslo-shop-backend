import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Order status',
    example: OrderStatus.PENDING,
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
