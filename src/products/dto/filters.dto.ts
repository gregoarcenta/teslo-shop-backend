import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsArray,
  ArrayUnique,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type as ProductType } from '../enums/type';
import { Gender, Size, SortBy } from '../enums';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class ProductsFilterDto extends PaginateDto {
  @ApiPropertyOptional({ description: 'Search term', example: 'Bomber Jacket' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title?: string;

  @ApiPropertyOptional({
    description: 'Product Gender (e.g., men, women, unisex)',
    example: Gender.MEN,
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Product Types (array)',
    example: [ProductType.SHIRTS],
    enum: ProductType,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(ProductType, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  type?: ProductType[];

  @ApiPropertyOptional({
    description: 'Product Sizes (array)',
    example: ['S', 'M', 'L'],
    enum: Size,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(Size, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  sizes?: Size[];

  @ApiPropertyOptional({ description: 'Minimum price', example: '10' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: '200' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Product order',
    example: 'newest',
    enum: SortBy,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortBy)
  order?: SortBy;
}
