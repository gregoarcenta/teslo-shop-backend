import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignInDto {
  @ApiProperty({ description: 'SignIn email', example: 'test@test.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'SignIn password', example: 'Test123' })
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}
