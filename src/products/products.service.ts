import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../modules/auth/entities/user.entity';
import {
  DataSource,
  ILike,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import {
  CreateProductDto,
  ProductResponseDto,
  ProductsFilterDto,
  UpdateProductDto,
} from './dto';
import { Product, ProductImage } from './entities';
import { ProductsResponseDto } from './dto/products-response.dto';
import { SortBy, Type } from './enums';

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

  private createBaseQuery(userId?: string): SelectQueryBuilder<Product> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.createdBy', 'user')
      .leftJoinAndSelect('product.images', 'images');

    // Para saber si le ha dado like a un producto
    if (userId) {
      query.loadRelationCountAndMap(
        'product.isLiked',
        'product.likes',
        'userLike',
        (qb) => qb.where('userLike.user_id = :userId', { userId }),
      );
    }

    return query;
  }

  private applyFilters(
    query: SelectQueryBuilder<Product>,
    filters: {
      title?: string;
      gender?: string;
      type?: Type[];
      sizes?: string[];
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    const { title, gender, type, sizes, minPrice, maxPrice } = filters;

    if (title) {
      query.where('product.title ILIKE :title', { title: `%${title}%` });
    }

    if (gender) {
      query.andWhere('(product.gender = :gender OR product.gender = :unisex)', {
        gender,
        unisex: 'unisex',
      });
    }

    if (type && type.length > 0) {
      query.andWhere('product.type IN (:...type)', { type });
    }

    if (sizes && sizes.length > 0) {
      query.andWhere('product.sizes::text[] && ARRAY[:...sizes]::text[]', {
        sizes,
      });
    }
    if (minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }
  }

  async create(
    createProductDto: CreateProductDto,
    createdBy: User,
  ): Promise<{ message: string; data: ProductResponseDto }> {
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
      return {
        message: 'Producto creado con éxito',
        data: await this.findOne(product.id),
      };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findAll(
    {
      page,
      limit,
      title,
      gender,
      type,
      sizes,
      minPrice,
      maxPrice,
      order,
    }: ProductsFilterDto,
    userId?: string,
  ): Promise<ProductsResponseDto> {
    const query = this.createBaseQuery(userId);

    // Calcular paginación
    const { skip, take } = this.calculatePagination(page, limit);

    // Aplicar filtros
    this.applyFilters(query, {
      title,
      gender,
      type,
      sizes,
      minPrice,
      maxPrice,
    });

    // Aplicar ordenamiento
    switch (order) {
      case SortBy.NEWEST:
        query.orderBy('product.createdAt', 'DESC');
        break;
      case SortBy.PRICE_ASC:
        query.orderBy('product.price', 'ASC');
        break;
      case SortBy.PRICE_DESC:
        query.orderBy('product.price', 'DESC');
        break;
      default:
        query.orderBy('product.createdAt', 'DESC');
    }

    // Aplicar paginación
    query.skip(skip).take(take);

    try {
      const [products, totalItems] = await query.getManyAndCount();
      return this.createPaginatedResponse(products, totalItems, page, limit);
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findOne(term: string, userId?: string): Promise<ProductResponseDto> {
    let product: Product;
    const query = this.createBaseQuery(userId);

    if (isUUID(term)) {
      query.where('product.id = :id', { id: term });
    } else {
      query.where('product.title ILIKE :term OR product.slug = :term', {
        term,
      });
    }

    try {
      product = await query.getOne();
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!product) throw new NotFoundException(`Product ${term} not found`);

    return this.transformProductData(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    createdBy: User,
  ): Promise<ProductResponseDto> {
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

  async updateStock(productId: string, quantity: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await queryRunner.manager
        .createQueryBuilder(Product, 'product')
        .setLock('pessimistic_write')
        .where('product.id = :id', { id: productId })
        .getOne();

      if (product) {
        product.stock += quantity;
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();
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
      return { message: `Product ${product.title} has been removed` };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async removeAll(): Promise<void> {
    const query = this.productRepository.createQueryBuilder();
    try {
      await query.delete().execute();
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

  private calculatePagination(page: number, limit: number) {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  private createPaginatedResponse(
    products: Product[],
    total: number,
    page: number,
    limit: number,
  ): ProductsResponseDto {
    return {
      products: products.map((product) => this.transformProductData(product)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private transformProductData(
    product: Product & { isLiked?: number },
  ): ProductResponseDto {
    return {
      ...product,
      createdBy: product.createdBy.fullName,
      images: product.images.map((image) => image.name),
      isLiked: product.isLiked > 0,
    };
  }
}
