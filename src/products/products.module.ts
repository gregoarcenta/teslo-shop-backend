import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HandlerException } from '../common/exceptions/handler.exception';
import { AuthModule } from '../auth/auth.module';
import { ProductImage } from './entities/product-image.entity';

@Module({
  controllers: [ProductsController],
  imports: [AuthModule, TypeOrmModule.forFeature([Product, ProductImage])],
  providers: [ProductsService, HandlerException],
  exports: [ProductsService],
})
export class ProductsModule {}
