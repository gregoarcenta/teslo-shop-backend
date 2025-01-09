import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart, CartItem } from './entities';
import { HandlerException } from '../common/exceptions/handler.exception';

describe('CartService', () => {
  let service: CartService;

  const mockCartRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCartItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockHandlerException = {
    handlerDBException: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartItemRepository,
        },
        {
          provide: HandlerException,
          useValue: mockHandlerException,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cart for a user', async () => {
      const user = { id: '1', fullName: 'John Doe' } as any;
      const cart = { id: 'cart1', user } as any;

      mockCartRepository.create.mockReturnValue(cart);
      mockCartRepository.save.mockResolvedValue(cart);

      await service.create(user);

      expect(mockCartRepository.create).toHaveBeenCalledWith({ user });
      expect(mockCartRepository.save).toHaveBeenCalledWith(cart);
    });

    it('should throw BadRequestException if cart already exists', async () => {
      const user = { id: '1', fullName: 'John Doe' } as any;

      mockCartRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(user)).rejects.toThrow(
        `The user ${user.fullName} already have a cart`,
      );
    });

    it('should call handlerDBException for other errors', async () => {
      const user = { id: '1', fullName: 'John Doe' } as any;

      const error = new Error('DB Error');
      mockCartRepository.save.mockRejectedValue(error);

      await service.create(user);

      expect(mockHandlerException.handlerDBException).toHaveBeenCalledWith(
        error,
      );
    });
  });

  describe('getCart', () => {
    it('should return a cart with total', async () => {
      const userId = '1';
      const cart = {
        id: 'cart1',
        cartItems: [
          {
            quantity: 2,
            product: { price: 100, createdBy: { id: 1, fullName: 'Admin' } },
          },
          {
            quantity: 1,
            product: { price: 200, createdBy: { id: 1, fullName: 'Admin' } },
          },
        ],
      } as any;

      mockCartRepository.findOne.mockResolvedValue(cart);

      const result = await service.getCart(userId);

      expect(mockCartRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });

      expect(result).toEqual({
        id: 'cart1',
        total: 400,
        cartItems: expect.any(Array),
      });
    });

    it('should throw NotFoundException if cart is not found', async () => {
      const userId = '1';

      mockCartRepository.findOne.mockResolvedValue(null);

      await expect(service.getCart(userId)).rejects.toThrow('Cart not found');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from the cart', async () => {
      const userId = '1';
      const cart = { id: 'cart1', cartItems: [{}] } as any;

      mockCartRepository.findOne.mockResolvedValue(cart);
      mockCartItemRepository.remove.mockResolvedValue(undefined);

      const result = await service.clearCart(userId);

      expect(mockCartRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(mockCartItemRepository.remove).toHaveBeenCalledWith(
        cart.cartItems,
      );
      expect(result).toEqual({ message: 'Carts cleared' });
    });

    it('should call handlerDBException on error', async () => {
      const userId = '1';
      const error = new Error('DB Error');

      mockCartRepository.findOne.mockResolvedValue({ cartItems: [{}] });
      mockCartItemRepository.remove.mockRejectedValue(error);

      await expect(service.clearCart(userId)).resolves.toBeUndefined();

      expect(mockHandlerException.handlerDBException).toHaveBeenCalledWith(
        error,
      );
    });
  });

  describe('addProductToCart', () => {
    it('should increment quantity if product already exists in cart', async () => {
      const cartProductDto = { cartId: 'cart1', productId: 'product1' };
      const cartItem = { id: 'item1', quantity: 1 } as any;

      mockCartItemRepository.findOne.mockResolvedValue(cartItem);
      mockCartItemRepository.save.mockResolvedValue({
        ...cartItem,
        quantity: 2,
      });

      await service.addProductToCart(cartProductDto);

      expect(mockCartItemRepository.findOne).toHaveBeenCalledWith({
        where: {
          cart: { id: cartProductDto.cartId },
          product: { id: cartProductDto.productId },
        },
      });
      expect(mockCartItemRepository.save).toHaveBeenCalledWith(cartItem);
    });

    it('should create a new cart item if product does not exist in cart', async () => {
      const cartProductDto = { cartId: 'cart1', productId: 'product1' };
      const newCartItem = { id: 'item1', quantity: 1 } as any;

      mockCartItemRepository.findOne.mockResolvedValue(null);
      mockCartItemRepository.create.mockReturnValue(newCartItem);
      mockCartItemRepository.save.mockResolvedValue(newCartItem);

      await service.addProductToCart(cartProductDto);

      expect(mockCartItemRepository.create).toHaveBeenCalledWith({
        cart: { id: cartProductDto.cartId },
        product: { id: cartProductDto.productId },
      });
      expect(mockCartItemRepository.save).toHaveBeenCalledWith(newCartItem);
      expect(mockCartItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: newCartItem.id },
      });
    });
  });

  describe('updateProductQuantity', () => {
    it('should update the quantity of a cart item', async () => {
      const cartProductUpdateDto = {
        cartId: 'cart1',
        productId: 'product1',
        quantity: 3,
      };
      const cartItem = {
        id: 'item1',
        quantity: 1,
        product: {
          id: 'product1',
          createdBy: { fullName: 'admin' },
        },
      } as any;

      mockCartItemRepository.findOne.mockResolvedValue(cartItem);

      const result = await service.updateProductQuantity(cartProductUpdateDto);

      console.log(result);

      expect(mockCartItemRepository.findOne).toHaveBeenCalledWith({
        where: {
          cart: { id: cartProductUpdateDto.cartId },
          product: { id: cartProductUpdateDto.productId },
        },
      });
      expect(result).toEqual(expect.objectContaining({ quantity: 3 }));
    });

    it('should throw NotFoundException if cart item does not exist', async () => {
      const cartProductUpdateDto = {
        cartId: 'cart1',
        productId: 'product1',
        quantity: 3,
      };

      mockCartItemRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateProductQuantity(cartProductUpdateDto),
      ).rejects.toThrow('Product not found in cart');
    });
  });

  describe('removeProductFromCart', () => {
    it('should remove a product from the cart', async () => {
      const cartProductDto = { cartId: 'cart1', productId: 'product1' };
      const cartItem = { id: 'item1' } as any;

      mockCartItemRepository.findOne.mockResolvedValue(cartItem);
      mockCartItemRepository.remove.mockResolvedValue(undefined);

      const result = await service.removeProductFromCart(cartProductDto);

      expect(mockCartItemRepository.findOne).toHaveBeenCalledWith({
        where: {
          cart: { id: cartProductDto.cartId },
          product: { id: cartProductDto.productId },
        },
      });
      expect(result).toEqual({ message: 'Product removed from cart' });
    });

    it('should throw NotFoundException if product does not exist in cart', async () => {
      const cartProductDto = { cartId: 'cart1', productId: 'product1' };

      mockCartItemRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeProductFromCart(cartProductDto),
      ).rejects.toThrow('Product not found in the cart');
    });
  });
});
