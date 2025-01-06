import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class ProductResponseDto extends OmitType(Product, [
  'createdBy',
  'images',
]) {
  @ApiProperty({ description: 'Product createdBy', example: 'Admin' })
  createdBy: string;
  images: string[];
}
