import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Type as ProductType } from '../enums/type';
import { Gender, Size } from '../enums';

export class CreateProductDto {
  @ApiProperty({ description: 'Product title', example: 'T-shirt teslo' })
  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value.trim())
  title: string;

  @ApiPropertyOptional({
    description: 'Product slug',
    example: 't-shirt-teslo',
  })
  @IsString()
  @Length(3, 100)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsString()
  @MinLength(10)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  description?: string;

  @ApiPropertyOptional({ example: '10.99', description: 'Product price' })
  @IsString()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  price?: string;

  @ApiPropertyOptional({ description: 'Product stock', example: 10 })
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @ApiProperty({ description: 'Product type', example: 'shirts' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ example: 'men', description: 'Product gender' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @IsArray()
  @IsEnum(Size, { each: true })
  sizes: Size[];

  @ApiPropertyOptional({ example: ['shirt'], description: 'Product tags' })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product images',
  })
  @IsString({ each: true })
  @Length(1, 50, { each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
