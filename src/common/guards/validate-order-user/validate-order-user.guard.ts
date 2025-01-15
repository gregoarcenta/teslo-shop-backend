import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PaymentSessionDto } from '../../../payments/dto/payment-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandlerException } from '../../exceptions/handler.exception';
import { Order } from '../../../orders/entities';

@Injectable()
export class ValidateOrderUserGuard implements CanActivate {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly handlerException: HandlerException,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const { orderId } = req.body as PaymentSessionDto;
    const { id: userId } = req.user;

    return this.orderRepository
      .findOneBy({ id: orderId })
      .then((order) => {
        if (!order) throw new NotFoundException('Order not found');

        return order.user.id === userId;
      })
      .catch((err) => {
        if (err instanceof NotFoundException) throw err;
        this.handlerException.handlerDBException(err);
      });
  }
}
