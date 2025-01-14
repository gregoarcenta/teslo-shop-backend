import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenSessionDto {
  @ApiProperty({
    description: 'Order token session',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmRlcklkIjoiNDI1N2UxODItNzAzYy00NmVkLThlYWItMWMxZjRlMGE2ZGRhIiwiaWF0IjoxNzM2ODc5MDkyLCJleHAiOjE3MzY4NzkzOTJ9.RbYr9J9O7U6P-LIFfbTzzbULyCi5inizsNVKdgPmteM',
  })
  @IsString()
  token: string;
}
