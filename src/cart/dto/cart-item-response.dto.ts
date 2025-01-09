import { PickType } from '@nestjs/swagger';
import { CartItem } from '../entities/cart-item.entity';
import { ProductResponseDto } from '../../products/dto';

export class CartItemResponseDto extends PickType(CartItem, [
  'id',
  'quantity',
]) {
  product: ProductResponseDto;
}
