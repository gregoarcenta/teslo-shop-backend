import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class FavoriteDto {
  @ApiProperty({
    description: 'Favorite product id',
    example: 'e1beca5d-39df-403e-b139-600b0a334506',
  })
  @IsString()
  @IsUUID()
  productId: string;
}
