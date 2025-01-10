import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Order, OrderItems } from './entities';
import { HandlerException } from '../common/exceptions/handler.exception';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, HandlerException],
  imports: [AuthModule, TypeOrmModule.forFeature([Order, OrderItems])],
})
export class OrdersModule {}
