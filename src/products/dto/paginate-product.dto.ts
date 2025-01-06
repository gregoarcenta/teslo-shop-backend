import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginateProductDto {
  @ApiPropertyOptional({ description: 'Limit page', example: '5' })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @ApiPropertyOptional({ description: 'Offset page', example: '0' })
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset: number;
}
