import { OrderItem } from '../entities';
import { PickType } from '@nestjs/swagger';
import { Product } from '../../products/entities';

export class OrderItemResponseDto extends PickType(OrderItem, [
  'id',
  'quantity',
  'price',
]) {
  product: Pick<Product, 'id' | 'title'>;
}
