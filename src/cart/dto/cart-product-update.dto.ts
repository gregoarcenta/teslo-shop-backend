import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CartProductDto } from './cart-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CartProductUpdateDto extends CartProductDto {
  @ApiProperty({ description: 'CartItem quantity', example: 2 })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}
