import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartProductDto, CartProductUpdateDto } from './dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities';
import { Product } from '../products/entities';
import { HandlerException } from '../common/exceptions/handler.exception';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    getCart: jest.fn(),
    clearCart: jest.fn(),
    addProductToCart: jest.fn(),
    updateProductQuantity: jest.fn(),
    removeProductFromCart: jest.fn(),
  };

  const mockCartRepository = {
    findOne: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        HandlerException,
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the cart for a user', async () => {
    const userId = 'user123';
    const mockCart = { items: [] };
    mockCartService.getCart.mockResolvedValue(mockCart);

    expect(await controller.getCart(userId)).toEqual(mockCart);
    expect(service.getCart).toHaveBeenCalledWith(userId);
  });

  it('should clear the cart for a user', async () => {
    const userId = 'user123';
    const mockResponse = 'Cart cleared';
    mockCartService.clearCart.mockResolvedValue(mockResponse);

    expect(await controller.clearCart(userId)).toEqual(mockResponse);
    expect(service.clearCart).toHaveBeenCalledWith(userId);
  });

  it('should add a product to the cart', async () => {
    const cartProductDto: CartProductDto = {
      cartId: 'cart1',
      productId: 'prod1',
    };
    const mockResponse = { message: 'Product added to cart' };
    mockCartService.addProductToCart.mockResolvedValue(mockResponse);

    expect(await controller.addProductToCart(cartProductDto)).toEqual(
      mockResponse,
    );
    expect(service.addProductToCart).toHaveBeenCalledWith(cartProductDto);
  });

  it('should update the quantity of a product in the cart', async () => {
    const cartProductUpdateDto: CartProductUpdateDto = {
      cartId: 'cart1',
      productId: 'prod1',
      quantity: 2,
    };
    const mockResponse = { message: 'Product quantity updated' };
    mockCartService.updateProductQuantity.mockResolvedValue(mockResponse);

    expect(await controller.updateQuantity(cartProductUpdateDto)).toEqual(
      mockResponse,
    );
    expect(service.updateProductQuantity).toHaveBeenCalledWith(
      cartProductUpdateDto,
    );
  });

  it('should remove a product from the cart', async () => {
    const cartProductDto: CartProductDto = {
      cartId: 'cart1',
      productId: 'prod1',
    };
    const mockResponse = { message: 'Product removed from cart' };
    mockCartService.removeProductFromCart.mockResolvedValue(mockResponse);

    expect(await controller.removeProductFromCart(cartProductDto)).toEqual(
      mockResponse,
    );
    expect(service.removeProductFromCart).toHaveBeenCalledWith(cartProductDto);
  });
});
