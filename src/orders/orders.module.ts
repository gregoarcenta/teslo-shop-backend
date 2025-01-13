import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Order, OrderItem } from './entities';
import { HandlerException } from '../common/exceptions/handler.exception';
import { CartModule } from '../cart/cart.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, HandlerException],
  imports: [
    AuthModule,
    CartModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
