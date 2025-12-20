import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBody,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { ValidateOrderUserGuard } from '../common/guards/validate-order-user/validate-order-user.guard';
import { TokenSessionDto } from './dto/token-session.dto';
import {
  ApiCreatePaymentSessionResponse,
  ApiValidateTokenResponse,
  ApiWebhookResponse,
} from '../swagger/decorators/payment';
import { Auth } from '../modules/auth/decorators';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  @UseGuards(ValidateOrderUserGuard)
  @Auth()
  @ApiCreatePaymentSessionResponse()
  createPaymentSession(
    @Body() paymentSessionDto: PaymentSessionDto,
    @Headers('origin') origin: string,
  ) {
    return this.paymentsService.createPaymentSession(paymentSessionDto, origin);
  }

  @Post('webhook')
  @ApiWebhookResponse()
  async handleStripeWebhook(
    @RawBody() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(payload, signature);
  }

  @Post('validate-token-session')
  @Auth()
  @ApiValidateTokenResponse()
  async validateTokenSession(@Body() tokenSessionDto: TokenSessionDto) {
    return this.paymentsService.validateToken(tokenSessionDto);
  }

  @Get('success')
  @ApiExcludeEndpoint()
  success() {
    return this.paymentsService.success();
  }

  @Get('cancel')
  @ApiExcludeEndpoint()
  cancel() {
    return this.paymentsService.cancel();
  }
}
