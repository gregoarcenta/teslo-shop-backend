import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class ProductResponseDto extends OmitType(Product, [
  'createdBy',
  'checkSlugInsert',
]) {
  @ApiProperty({ description: 'Product createdBy', example: 'Admin' })
  createdBy: string;
}
