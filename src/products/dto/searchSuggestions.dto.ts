import { IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchSuggestionsDto {
  @ApiProperty({
    description: 'Search query string',
    example: 'shirt',
  })
  @IsString()
  @MinLength(2)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  query: string;

  @ApiProperty({
    description: 'Maximum number of suggestions to return',
    example: 5,
    required: false,
    default: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 1;
}
