import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HandlerException } from '../common/exceptions/handler.exception';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  imports: [AuthModule, TypeOrmModule.forFeature([Product])],
  providers: [ProductsService, HandlerException],
})
export class ProductsModule {}
