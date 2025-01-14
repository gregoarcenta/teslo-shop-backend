import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities';
import { CartService } from '../cart/cart.service';
import { HandlerException } from '../common/exceptions/handler.exception';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CartResponseDto } from '../cart/dto';
import { Gender, Size, Type } from '../products/enums';
import { ProductResponseDto } from '../products/dto';
import { OrderResponseDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    query: jest.fn(),
    manager: {
      createQueryBuilder: jest.fn().mockReturnThis(),
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      save: jest.fn(),
    },
  }),
};

const mockUser: User = { id: 'test-user', email: 'user@gmail.com' } as User;
const mockProduct: ProductResponseDto = {
  id: 'product-ID',
  title: 'T-shirt Teslo',
  slug: 't-shirt-teslo',
  description: 'lorem ipsum dolor sit amet',
  price: '10.99',
  stock: 10,
  type: Type.SHIRTS,
  gender: Gender.MEN,
  sizes: [Size.XS],
  tags: ['shirt'],
  createdAt: new Date(),
  createdBy: 'Admin',
  images: ['image1.jpg', 'image2.jpg'],
};
const mockCart: CartResponseDto = {
  id: 'cart-ID',
  total: '100.00',
  cartItems: [
    {
      id: 'cart-item-ID',
      quantity: 1,
      product: mockProduct,
    },
  ],
};
const mockOrderItems = [
  {
    price: mockProduct.price,
    quantity: mockCart.cartItems[0].quantity,
    product: { id: mockCart.cartItems[0].product.id },
  },
];
const mockOrder: Partial<Order> = {
  id: 'order-ID',
  user: mockUser,
  totalItems: 1,
  totalAmount: '200.00',
  items: mockOrderItems as OrderItem[],
};

describe('OrdersService', () => {
  let orderService: OrdersService;
  let cartService: CartService;
  let handlerException: HandlerException;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        HandlerException,
        {
          provide: CartService,
          useValue: {
            getCart: jest.fn(),
            clearCart: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            updateStock: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn().mockReturnValue(mockOrder),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([mockProduct]),
            findOne: jest.fn().mockResolvedValue(mockOrder),
          },
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {
            create: jest.fn().mockReturnValue(mockOrderItems),
            save: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    orderService = module.get<OrdersService>(OrdersService);
    cartService = module.get<CartService>(CartService);
    handlerException = module.get<HandlerException>(HandlerException);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      jest.spyOn(cartService, 'getCart').mockResolvedValue(mockCart);
      jest.spyOn(orderService, 'findOne').mockResolvedValue({
        ...mockOrder,
        userEmail: mockUser.email,
      } as OrderResponseDto);

      mockDataSource
        .createQueryRunner()
        .manager.getOne.mockResolvedValue(mockProduct);

      const queryRunner = mockDataSource.createQueryRunner();

      const result = await orderService.create(mockUser);

      expect(cartService.getCart).toHaveBeenCalledWith(mockUser.id);
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.query).toHaveBeenCalledWith(
        "SET lock_timeout = '15000ms'",
      );
      expect(mockProduct.stock).toBe(9);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockProduct);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockOrder);
      expect(cartService.clearCart).toHaveBeenCalledWith(mockUser.id);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();

      expect(result).toEqual({
        message: 'Order created',
        data: expect.any(Object),
      });
    });

    it('should throw a BadRequestException if cart is empty', async () => {
      const mockCartEmpty = { cartItems: [] } as CartResponseDto;

      jest.spyOn(cartService, 'getCart').mockResolvedValue(mockCartEmpty);

      await expect(orderService.create(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle product not found', async () => {
      const expectedMessage = `Product with ID ${mockProduct.id} not found.`;

      jest.spyOn(cartService, 'getCart').mockResolvedValue(mockCart);
      mockDataSource.createQueryRunner().manager.getOne.mockResolvedValue(null);

      try {
        await orderService.create(mockUser);
      } catch (error) {
        expect(error.message).toBe(expectedMessage);
      }
    });

    it('should handle not enough stock', async () => {
      mockProduct.stock = 0;
      jest.spyOn(cartService, 'getCart').mockResolvedValue(mockCart);

      mockDataSource
        .createQueryRunner()
        .manager.getOne.mockResolvedValue(mockProduct);

      try {
        await orderService.create(mockUser);
      } catch (error) {
        expect(error.message).toBe(
          `Not enough stock for product "${mockProduct.title}". Available: ${mockProduct.stock}.`,
        );
      }
    });
  });
});
