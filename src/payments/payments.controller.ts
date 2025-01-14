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
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response/api-response.interceptor';
import { Auth } from '../auth/decorators';
import { ValidateOrderUserGuard } from '../common/guards/validate-order-user/validate-order-user.guard';

@ApiTags('Payments')
@UseInterceptors(ApiResponseInterceptor)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  @UseGuards(ValidateOrderUserGuard)
  @Auth()
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Post('webhook')
  async handleStripeWebhook(
    @RawBody() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(payload, signature);
  }

  @Get('success')
  success() {
    return this.paymentsService.success();
  }

  @Get('cancel')
  cancel() {
    return this.paymentsService.cancel();
  }
}
