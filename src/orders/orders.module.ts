import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../modules/auth/auth.module';
import { Order, OrderItem } from './entities';
import { HandlerException } from '../common/exceptions/handler.exception';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, HandlerException],
  imports: [
    AuthModule,
    CartModule,
    ProductsModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
