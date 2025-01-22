import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type as ProductType } from '../enums/type';

type orderBy = 'newest' | 'increasingPrice' | 'decreasingPrice';

export class PaginateProductDto {
  @ApiPropertyOptional({ description: 'Limit page', example: '5' })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset page', example: '0' })
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Product Type',
    example: ProductType.SHIRTS,
    enum: ProductType,
  })
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @ApiPropertyOptional({ description: 'Product order', example: 'newest' })
  @IsString()
  @IsIn(['newest', 'increasingPrice', 'decreasingPrice'], {
    message: 'Order must be one of: newest, increasingPrice, decreasingPrice',
  })
  @IsOptional()
  order?: orderBy;

  @ApiPropertyOptional({ description: 'Search term', example: 'Bomber Jacket' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim().toLowerCase())
  term?: string;
}
