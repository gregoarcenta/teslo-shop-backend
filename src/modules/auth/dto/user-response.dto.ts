import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'UserResponse User' })
  user: User;

  @ApiProperty({
    description: 'UserResponse accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhOTkyNjdiLWZmOWItNDRlOS05OTRmLTNlZGRmZTljZTk3NSIsImlhdCI',
  })
  accessToken: string;

  @ApiProperty({
    description: 'UserResponse cartId',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  cartId: string;
}
