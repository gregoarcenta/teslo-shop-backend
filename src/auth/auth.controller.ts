import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Auth, GetUser } from './decorators';
import {
  ApiCheckStatusResponse,
  ApiSignInResponse,
  ApiSignUpResponse,
} from '../swagger/decorators/auth';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto, SignUpDto } from './dto';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ApiResponseInterceptor)
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
