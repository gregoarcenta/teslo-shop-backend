import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { HandlerException } from '../common/exceptions/handler.exception';
import { OnEvent } from '@nestjs/event-emitter';
import { CartItem } from './entities/cart-item.entity';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';

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
      console.log('Se ha creado el carrito con exito');
    } catch (err) {
      if (err.code === '23505') {
        throw new BadRequestException(
          `The user ${user.fullName} already have a cart`,
        );
      }
      this.handlerException.handlerDBException(err);
    }
  }

  async addProductToCart(
    addProductToCartDto: AddProductToCartDto,
  ): Promise<{ message: string; data: CartItem }> {
    const { cartId, productId } = addProductToCartDto;

    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: {
          cart: { id: cartId },
          product: { id: addProductToCartDto.productId },
        },
      });

      if (cartItem) {
        cartItem.quantity += 1;
        await this.cartItemRepository.save(cartItem);
        return {
          message: 'Product added to cart',
          data: cartItem,
        };
      }

      const newCartItem = this.cartItemRepository.create({
        cart: { id: cartId },
        product: { id: productId },
      });

      await this.cartItemRepository.save(newCartItem);

      return {
        message: 'Product added to cart',
        data: newCartItem,
      };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
