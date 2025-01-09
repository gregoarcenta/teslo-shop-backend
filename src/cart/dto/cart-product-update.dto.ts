import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CartProductDto } from './cart-product.dto';

export class CartProductUpdateDto extends CartProductDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}
