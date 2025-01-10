import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Order } from './entities';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [AuthModule, TypeOrmModule.forFeature([Order])],
})
export class OrdersModule {}
