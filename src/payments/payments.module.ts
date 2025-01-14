import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { HandlerException } from '../common/exceptions/handler.exception';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, HandlerException],
  imports: [AuthModule, OrdersModule],
})
export class PaymentsModule {}
