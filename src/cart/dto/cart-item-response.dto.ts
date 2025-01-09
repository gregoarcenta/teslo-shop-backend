import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductResponseDto } from '../../products/dto';
import { CartItem } from '../entities';

export class CartItemResponseDto extends PickType(CartItem, [
  'id',
  'quantity',
]) {
  @ApiProperty({ description: 'CartItem product', type: ProductResponseDto })
  product: ProductResponseDto;
}
