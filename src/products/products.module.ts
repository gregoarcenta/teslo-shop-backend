import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { AuthModule } from '../auth/auth.module';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, HandlerException],
  imports: [AuthModule, TypeOrmModule.forFeature([Product, ProductImage])],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
