import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Auth, GetUser } from './decorators';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto, SignUpDto } from './dto';
import {
  ApiCheckStatusResponse,
  ApiSignInResponse,
  ApiSignUpResponse,
} from '../../swagger/decorators/auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiSignUpResponse()
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiSignInResponse()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('check-status')
  @Auth()
  @ApiCheckStatusResponse()
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}
