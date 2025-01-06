import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities/product.entity';
import { ILike, Not, Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductImage } from './entities/product-image.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  constructor(
    private readonly handlerException: HandlerException,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    createdBy: User,
  ): Promise<ProductResponseDto> {
    // Build product with images
    const productDto = this.buildCreateDtoWithImages(createProductDto);

    // Generate and validate slug
    productDto.slug = await this.createSlug(productDto);

    try {
      const product = this.productRepository.create({
        ...productDto,
        createdBy,
      });
      await this.productRepository.save(product);
      return this.findOne(product.id);
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findAll() {
    return `This action returns all products`;
  }

  async findOne(term: string): Promise<ProductResponseDto> {
    const id = isUUID(term) ? term : null;
    let product: Product;
    try {
      product = await this.productRepository.findOne({
        where: [{ id }, { title: ILike(`%${term}%`) }, { slug: term }],
      });
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!product) throw new NotFoundException(`Product ${term} not found`);

    return {
      ...product,
      createdBy: product.createdBy.fullName,
      images: product.images.map((image) => image.name),
    };
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private async createSlug(product: Product): Promise<string> {
    const { title, slug } = product;
    if (!slug) return this.convertToSlug(title);

    await this.validateSlugUniqueness(slug);

    return this.convertToSlug(slug);
  }

  private async validateSlugUniqueness(slug: string, id?: string) {
    const existingProduct = await this.productRepository.findOne({
      where: { slug, ...(id ? { id: Not(id) } : {}) },
    });

    if (existingProduct) {
      throw new BadRequestException('Slug already exists');
    }
  }

  private convertToSlug(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase() // Convertir a minúsculas
      .trim() // Eliminar espacios en blanco al principio y al final
      .replace(/[\s\W-]+/g, '-') // Reemplazar espacios y caracteres no alfanuméricos por guiones
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al principio y al final
  }

  private buildCreateDtoWithImages(
    dto: UpdateProductDto | CreateProductDto,
  ): Product {
    const { images, ...productProperties } = dto;
    let product: Partial<Product> = {
      ...productProperties,
    };

    if (images?.length > 0) {
      product.images = images.map((image) =>
        this.productImageRepository.create({ name: image }),
      );
    }
    return product as Product;
  }
}
