import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities/product.entity';
import { DataSource, ILike, Not, Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductImage } from './entities/product-image.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dataSource: DataSource,
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
        where: [{ id }, { title: ILike(term) }, { slug: term }],
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    createdBy: User,
  ) {
    // Build product with images
    let productDto: Product = this.buildCreateDtoWithImages(updateProductDto);
    productDto.id = id;

    // Generate and validate slug
    const slug = await this.updateSlug(productDto);
    if (slug) productDto.slug = slug;

    // Carga la instancia del producto a actualizar
    productDto = await this.productRepository.preload({
      ...productDto,
      createdBy,
    });

    if (!productDto)
      throw new NotFoundException(`Product with id: ${id} not found`);

    // Crea un QueryRunner para iniciar una transaccion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Si existen imagenes nuevas se eliminan las anteriores
      if (productDto.images?.length > 0) {
        await queryRunner.manager.delete(ProductImage, { product: id });
      }
      // Actualiza el producto
      await queryRunner.manager.save(productDto);
      // Commit de la transaccion
      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.handlerException.handlerDBException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    try {
      await this.productRepository.delete(product.id);
      return `Product ${product.title} has been removed`;
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async removeAll() {
    const query = this.productRepository.createQueryBuilder();
    try {
      return await query.delete().execute();
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  private async createSlug(product: Product): Promise<string> {
    const { title, slug } = product;
    if (!slug) return this.convertToSlug(title);

    await this.validateSlugUniqueness(slug);

    return this.convertToSlug(slug);
  }

  private async updateSlug(product: Product): Promise<string | null> {
    const { id, title, slug } = product;
    if (!slug) {
      if (title) return this.convertToSlug(title);
      else return null;
    }

    await this.validateSlugUniqueness(slug, id);

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
