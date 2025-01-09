import { PickType } from '@nestjs/swagger';
import { ProductResponseDto } from '../../products/dto';
import { CartItem } from '../entities';

export class CartItemResponseDto extends PickType(CartItem, [
  'id',
  'quantity',
]) {
  product: ProductResponseDto;
}
