import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly handlerException: HandlerException,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    createdBy: User,
  ): Promise<ProductResponseDto> {
    try {
      const product = this.productRepository.create({
        ...createProductDto,
        createdBy,
      });
      await this.productRepository.save(product);
      return { ...product, createdBy: product.createdBy.fullName };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
