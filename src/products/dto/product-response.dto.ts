import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class ProductResponseDto extends OmitType(Product, [
  'createdBy',
  'images',
]) {
  @ApiProperty({ description: 'Product createdBy', example: 'Admin' })
  createdBy: string;

  @ApiProperty({
    description: 'Product images',
    example: ['image1.jpg', 'image2.jpg'],
  })
  images: string[];
}
