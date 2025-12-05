import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, PaginateProductDto, UpdateProductDto } from './dto';
import { User } from '../modules/auth/entities/user.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      title: '',
      gender: undefined,
      sizes: [],
      type: undefined,
    };

    const user: User = {
      email: '',
      fullName: '',
      id: '',
      isActive: false,
      password: '',
      products: [],
      roles: [],
    };

    mockProductsService.create.mockReturnValue(createProductDto);

    expect(await controller.create(createProductDto, user)).toEqual(
      createProductDto,
    );
    expect(service.create).toHaveBeenCalledWith(createProductDto, user);
  });

  it('should return an array of products', async () => {
    const paginate: PaginateProductDto = { limit: 10, offset: 0 };
    const products = [{ id: '1', name: 'Product A', price: 100 }];

    mockProductsService.findAll.mockResolvedValue(products);

    expect(await controller.findAll(paginate)).toEqual(products);
    expect(service.findAll).toHaveBeenCalledWith(paginate);
  });

  it('should return a single product', async () => {
    const term = 'Product A';
    const product = { id: '1', name: 'Product A', price: 100 };

    mockProductsService.findOne.mockResolvedValue(product);

    expect(await controller.findOne(term)).toEqual(product);
    expect(service.findOne).toHaveBeenCalledWith(term);
  });

  it('should update a product', async () => {
    const updateProductDto: UpdateProductDto = { title: 'New title' };
    const id = '1';
    const user: User = {
      email: '',
      fullName: '',
      id: '',
      isActive: false,
      password: '',
      products: [],
      roles: [],
    };

    mockProductsService.update.mockResolvedValue(updateProductDto);

    expect(await controller.update(id, updateProductDto, user)).toEqual(
      updateProductDto,
    );
    expect(service.update).toHaveBeenCalledWith(id, updateProductDto, user);
  });

  it('should remove a product', async () => {
    const id = '1';

    mockProductsService.remove.mockResolvedValue('Product X has been removed');

    expect(await controller.remove(id)).toEqual('Product X has been removed');
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
