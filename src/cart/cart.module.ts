import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { HandlerException } from '../common/exceptions/handler.exception';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { AuthModule } from '../auth/auth.module';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [CartController],
  providers: [CartService, HandlerException],
  imports: [
    AuthModule,
    ProductsModule,
    TypeOrmModule.forFeature([Cart, CartItem]),
  ],
})
export class CartModule {}
