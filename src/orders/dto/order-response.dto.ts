import { Order } from '../entities';
import { OrderItemResponseDto } from './order-item-response.dto';
import { PickType } from '@nestjs/swagger';

export class OrderResponseDto extends PickType(Order, [
  'id',
  'createdAt',
  'status',
  'paid',
  'paidAt',
  'totalAmount',
  'totalItems',
]) {
  items: OrderItemResponseDto[];
}
