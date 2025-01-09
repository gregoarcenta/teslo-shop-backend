import { PickType } from '@nestjs/swagger';
import { Cart } from '../entities/cart.entity';
import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto extends PickType(Cart, ['id']) {
  total: number;
  cartItems: CartItemResponseDto[];
}
