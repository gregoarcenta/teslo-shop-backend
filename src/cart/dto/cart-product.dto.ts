import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartProductDto {
  @ApiProperty({
    description: 'CartItem cart id',
    example: 'e1beca5d-39df-403e-b139-600b0a334506',
  })
  @IsString()
  @IsUUID()
  cartId: string;

  @ApiProperty({
    description: 'CartItem product id',
    example: 'e1beca5d-39df-403e-b139-600b0a334506',
  })
  @IsString()
  @IsUUID()
  productId: string;
}
