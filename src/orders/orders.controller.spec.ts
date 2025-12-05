import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { User } from '../modules/auth/entities/user.entity';
import { UpdateOrderDto } from './dto';
import { Role } from '../config';
import { OrderStatus } from './enums/order-status';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockUser: User = {
    email: 'test@example.com',
    fullName: 'Test User',
    id: 'user-id-123',
    isActive: true,
    password: 'hashed-password',
    products: [],
    roles: [Role.USER],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    const result = { orderId: 'order-id-123' }; // El valor de retorno esperado
    mockOrdersService.create.mockResolvedValue(result);

    const response = await controller.create(mockUser);

    expect(response).toEqual(result);
    expect(mockOrdersService.create).toHaveBeenCalledWith(mockUser);
  });

  it('should return all orders', async () => {
    const mockOrders = [{ id: 'order-id-123', createdAt: new Date() }];
    mockOrdersService.findAll.mockResolvedValue(mockOrders);

    const response = await controller.findAll({ limit: 10, offset: 0 });

    expect(response).toEqual(mockOrders);
    expect(mockOrdersService.findAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
    });
  });

  it('should return orders of a specific user', async () => {
    const mockOrders = [{ id: 'order-id-123', createdAt: new Date() }];
    mockOrdersService.findAllByUser.mockResolvedValue(mockOrders);

    const response = await controller.findAllByUser(
      { limit: 10, offset: 0 },
      mockUser,
    );

    expect(response).toEqual(mockOrders);
    expect(mockOrdersService.findAllByUser).toHaveBeenCalledWith(
      { limit: 10, offset: 0 },
      mockUser,
    );
  });

  it('should return a single order', async () => {
    const mockOrder = { id: 'order-id-123', createdAt: new Date() };
    mockOrdersService.findOne.mockResolvedValue(mockOrder);

    const response = await controller.findOne('order-id-123');

    expect(response).toEqual(mockOrder);
    expect(mockOrdersService.findOne).toHaveBeenCalledWith('order-id-123');
  });

  it('should update an order', async () => {
    const mockUpdatedOrder = { id: 'order-id-123', status: 'updated' };
    const updateOrderDto: UpdateOrderDto = { status: OrderStatus.DELIVERED };
    mockOrdersService.update.mockResolvedValue(mockUpdatedOrder);

    const response = await controller.update('order-id-123', updateOrderDto);

    expect(response).toEqual(mockUpdatedOrder);
    expect(mockOrdersService.update).toHaveBeenCalledWith(
      'order-id-123',
      updateOrderDto,
    );
  });
});
