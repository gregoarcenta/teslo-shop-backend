import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from '../entities';
import { ProductResponseDto } from './product-response.dto';

export class ProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto], description: 'List of products' })
  products: ProductResponseDto[];

  @ApiProperty({
    description: 'Total number of products matching the criteria',
    example: 10,
  })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of posts per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 2 })
  totalPages: number;
}
