import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartResponseDto } from './dto/cart-response.dto';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { OnEvent } from '@nestjs/event-emitter';
import { CartItem } from './entities/cart-item.entity';
import { CartProductDto } from './dto/cart-product.dto';
import { CartItemResponseDto } from './dto/cart-item-response.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly handlerException: HandlerException,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  @OnEvent('user.created')
  async create(user: User): Promise<void> {
    const cart = this.cartRepository.create({
      user,
    });
    try {
      await this.cartRepository.save(cart);
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException(
          `The user ${user.fullName} already have a cart`,
        );
      }
      this.handlerException.handlerDBException(err);
    }
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const total = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    return this.plainCart(cart, total);
  }

  async clearCart(userId: string): Promise<{ message: string }> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
      });
      await this.cartItemRepository.remove(cart.cartItems);
      return { message: 'Carts cleared' };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async addProductToCart(
    cartProductDto: CartProductDto,
  ): Promise<{ message: string; data: CartItemResponseDto }> {
    const { cartId, productId } = cartProductDto;

    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: { cart: { id: cartId }, product: { id: productId } },
      });

      if (cartItem) {
        cartItem.quantity += 1;
        await this.cartItemRepository.save(cartItem);
        return {
          message: 'Product added to cart',
          data: this.plainCartItem(cartItem),
        };
      }

      let newCartItem = this.cartItemRepository.create({
        cart: { id: cartId },
        product: { id: productId },
      });

      await this.cartItemRepository.save(newCartItem);

      newCartItem = await this.cartItemRepository.findOne({
        where: { id: newCartItem.id },
      });

      return {
        message: 'Product added to cart',
        data: this.plainCartItem(newCartItem),
      };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  updateProductQuantity(id: number) {
    return `This action updates a #${id} cart`;
  }

  async removeProductsFromCart(
    cartProductDto: CartProductDto,
  ): Promise<{ message: string }> {
    const { cartId, productId } = cartProductDto;
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cartId }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in the cart');
    }

    try {
      await this.cartItemRepository.remove(cartItem);
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    return { message: 'Product removed from cart' };
  }

  private plainCart(cart: Cart, total: number): CartResponseDto {
    return {
      id: cart.id,
      total,
      cartItems: cart.cartItems.map((item) => this.plainCartItem(item)),
    };
  }

  private plainCartItem(cartItem: CartItem): CartItemResponseDto {
    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      product: {
        ...cartItem.product,
        createdBy: cartItem.product.createdBy.fullName,
        images: cartItem.product.images.map((img) => img.name),
      },
    };
  }
}
