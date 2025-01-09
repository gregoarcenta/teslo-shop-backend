import { ValidateCartAndProductGuard } from './validate-cart-and-product.guard';
import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { HandlerException } from '../../exceptions/handler.exception';
import { Product } from '../../../products/entities';
import { Cart } from '../../../cart/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

describe('ValidateCartAndProductGuard', () => {
  let guard: ValidateCartAndProductGuard;

  const mockExecutionContext: Partial<ExecutionContext> = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        body: { cartId: 'cart1', productId: 'product1' },
        user: { id: 'user1' },
      }),
    }),
  };

  const mockCartRepository = {
    findOne: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  const mockHandlerException = {
    handlerDBException: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateCartAndProductGuard,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: HandlerException,
          useValue: mockHandlerException,
        },
      ],
    }).compile();

    guard = module.get<ValidateCartAndProductGuard>(
      ValidateCartAndProductGuard,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if cart and product exist', async () => {
    (mockCartRepository.findOne as jest.Mock).mockResolvedValue({
      id: 'cart1',
      user: { id: 'user1' },
    });
    (mockProductRepository.findOne as jest.Mock).mockResolvedValue({
      id: 'product1',
    });

    const result = await guard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toBe(true);
    expect(mockCartRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'cart1', user: { id: 'user1' } },
    });
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'product1' },
    });
  });

  it('should throw NotFoundException if cart does not exist', async () => {
    (mockCartRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(
      new NotFoundException(`User with id cart: cart1 not found`),
    );

    expect(mockCartRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'cart1', user: { id: 'user1' } },
    });
    expect(mockProductRepository.findOne).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if product does not exist', async () => {
    (mockCartRepository.findOne as jest.Mock).mockResolvedValue({
      id: 'cart1',
      user: { id: 'user1' },
    });
    (mockProductRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(
      new NotFoundException(`Product with id: product1 not found`),
    );

    expect(mockCartRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'cart1', user: { id: 'user1' } },
    });
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'product1' },
    });
  });

  it('should call handlerDBException if an error occurs', async () => {
    const dbError = new Error('Database Error');
    (mockCartRepository.findOne as jest.Mock).mockRejectedValue(dbError);

    await guard.canActivate(mockExecutionContext as ExecutionContext);

    expect(mockHandlerException.handlerDBException).toHaveBeenCalledWith(
      dbError,
    );
  });
});
