import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../../../cart/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartProductDto } from '../../../cart/dto/cart-product.dto';
import { HandlerException } from '../../exceptions/handler.exception';
import { Product } from '../../../products/entities';

@Injectable()
export class ValidateCartAndProductGuard implements CanActivate {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly handlerException: HandlerException,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const { cartId, productId } = req.body as CartProductDto;
    const { id: userId } = req.user;

    return this.cartRepository
      .findOne({ where: { id: cartId, user: { id: userId } } })
      .then((cart) => {
        if (!cart) {
          throw new NotFoundException(`User with id cart: ${cartId} not found`);
        }
        return this.productRepository.findOne({ where: { id: productId } });
      })
      .then((product: Product) => {
        if (!product) {
          throw new NotFoundException(
            `Product with id: ${productId} not found`,
          );
        }
        return true;
      })
      .catch((err) => {
        if (err instanceof NotFoundException) throw err;

        this.handlerException.handlerDBException(err);
      });
  }
}
