import { PickType } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-item-response.dto';
import { Cart } from '../entities';

export class CartResponseDto extends PickType(Cart, ['id']) {
  total: number;
  cartItems: CartItemResponseDto[];
}
