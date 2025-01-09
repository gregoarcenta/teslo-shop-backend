import { ApiProperty, PickType } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-item-response.dto';
import { Cart } from '../entities';

export class CartResponseDto extends PickType(Cart, ['id']) {
  @ApiProperty({ description: 'Cart total', example: 100.0 })
  total: number;

  @ApiProperty({ description: 'Cart Items', type: [CartItemResponseDto] })
  cartItems: CartItemResponseDto[];
}
