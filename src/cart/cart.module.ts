import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { HandlerException } from '../common/exceptions/handler.exception';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { Cart, CartItem } from './entities';

@Module({
  controllers: [CartController],
  providers: [CartService, HandlerException],
  imports: [
    AuthModule,
    ProductsModule,
    TypeOrmModule.forFeature([Cart, CartItem]),
  ],
  exports: [CartService],
})
export class CartModule {}
