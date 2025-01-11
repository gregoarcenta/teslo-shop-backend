import { OrderItem } from '../entities';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Product } from '../../products/entities';

export class OrderItemResponseDto extends PickType(OrderItem, [
  'id',
  'quantity',
  'price',
]) {
  @ApiProperty({
    description: 'Order items product',
    type: PickType(Product, ['id', 'title']),
  })
  product: Pick<Product, 'id' | 'title'>;
}
