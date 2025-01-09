import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductImage } from './entities';
import { HandlerException } from '../common/exceptions/handler.exception';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto, ProductResponseDto } from './dto';
import { User } from '../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let productImageRepository: Repository<ProductImage>;
  let dataSource: DataSource;
  let handlerException: HandlerException;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
  };

  const mockProductImageRepository = {
    create: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      manager: {
        save: jest.fn(),
      },
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    }),
  };

  const mockHandlerException = {
    handlerDBException: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: mockProductImageRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: HandlerException,
          useValue: mockHandlerException,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productImageRepository = module.get<Repository<ProductImage>>(
      getRepositoryToken(ProductImage),
    );
    dataSource = module.get<DataSource>(DataSource);
    handlerException = module.get<HandlerException>(HandlerException);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      gender: undefined,
      sizes: [],
      title: 'Product X',
      slug: 'product-x',
      type: undefined,
    };
    const user = {
      id: '1',
      fullName: 'User A',
      email: 'user@example.com',
    } as User;
    const product = {
      id: '1',
      title: 'Product X',
      slug: 'product-x',
      createdBy: user,
      images: [{ name: 'image1.jpg' }],
    };

    const expectedProduct = {
      id: '1',
      title: 'Product X',
      slug: 'product-x',
      createdBy: user.fullName,
      images: product.images.map((image) => image.name),
    };

    mockProductRepository.create.mockReturnValue(product);
    mockProductRepository.save.mockResolvedValue(product);
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(expectedProduct as ProductResponseDto);

    const result = await service.create(createProductDto, user);

    expect(result).toEqual({
      message: 'Producto creado con éxito',
      data: expectedProduct,
    });
    expect(mockProductRepository.create).toHaveBeenCalledWith(
      expect.objectContaining(createProductDto),
    );
    expect(mockProductRepository.create).toHaveBeenCalledWith({
      ...createProductDto,
      createdBy: user,
    });
    expect(mockProductRepository.save).toHaveBeenCalledWith(product);
    expect(service.findOne).toHaveBeenCalledWith(product.id);
  });

  it('should return all products', async () => {
    const paginate = { limit: 10, offset: 0 };
    const products = [
      {
        id: '1',
        title: 'Product A',
        createdBy: { fullName: 'User A' },
        images: [{ name: 'image1.jpg' }],
      },
    ];

    const expectedProducts = [
      {
        id: '1',
        title: 'Product A',
        createdBy: 'User A',
        images: ['image1.jpg'],
      },
    ];

    mockProductRepository.find.mockResolvedValue(products);

    const result = await service.findAll(paginate);

    expect(result).toEqual(expectedProducts);
    expect(mockProductRepository.find).toHaveBeenCalledWith({
      take: paginate.limit,
      skip: paginate.offset,
      order: { createdAt: 'DESC' },
    });
  });

  it('should throw NotFoundException when product not found', async () => {
    const term = 'nonexistent';
    mockProductRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(term)).rejects.toThrow(
      new NotFoundException(`Product ${term} not found`),
    );
  });

  it('should update a product', async () => {
    const updateProductDto = { title: 'Updated Title' };
    const id = '1';
    const user = {
      id: '1',
      fullName: 'User A',
      email: 'user@example.com',
    } as User;

    const updatedProduct = { ...updateProductDto, id, createdBy: user };

    const expectedProduct = {
      ...updateProductDto,
      id,
      createdBy: user.fullName,
    };

    mockProductRepository.preload.mockResolvedValue(updatedProduct);
    mockProductRepository.save.mockResolvedValue(updatedProduct);

    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(expectedProduct as ProductResponseDto);

    mockDataSource
      .createQueryRunner()
      .manager.save.mockResolvedValue(expectedProduct);

    const result = await service.update(id, updateProductDto, user);

    expect(result).toEqual(expectedProduct);
    expect(mockProductRepository.preload).toHaveBeenCalledWith({
      ...updateProductDto,
      slug: 'updated-title',
      id,
      createdBy: user,
    });
  });

  it('should throw NotFoundException when product to update not found', async () => {
    const updateProductDto = { title: 'Updated Title' };
    const id = '1';
    const user = {
      id: '1',
      fullName: 'User A',
      email: 'user@example.com',
    } as User;

    mockProductRepository.preload.mockResolvedValue(null);

    await expect(service.update(id, updateProductDto, user)).rejects.toThrow(
      new NotFoundException(`Product with id: ${id} not found`),
    );
  });

  it('should remove a product', async () => {
    const id = '1';
    const product = { id, title: 'Product A' };

    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(product as ProductResponseDto);

    mockProductRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(id);

    expect(result).toEqual({ message: `Product Product A has been removed` });
    expect(mockProductRepository.delete).toHaveBeenCalledWith(product.id);
  });

  it('should throw NotFoundException when product to remove not found', async () => {
    const id = '1';

    mockProductRepository.findOne.mockResolvedValue(null);

    await expect(service.remove(id)).rejects.toThrow(
      new NotFoundException(`Product ${id} not found`),
    );
  });
});
