import { ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ValidateOrderUserGuard } from './validate-order-user.guard';
import { Order } from '../../../orders/entities';
import { HandlerException } from '../../exceptions/handler.exception';

describe('ValidateOrderUserGuard', () => {
  let guard: ValidateOrderUserGuard;
  let orderRepository: Repository<Order>;
  let handlerException: HandlerException;
  let context: ExecutionContext;

  beforeEach(() => {
    orderRepository = {
      findOneBy: jest.fn(),
    } as unknown as Repository<Order>;

    handlerException = {
      handlerDBException: jest.fn(),
    } as unknown as HandlerException;

    guard = new ValidateOrderUserGuard(orderRepository, handlerException);

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { orderId: 1 },
          user: { id: 1 },
        }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when user matches order user', async () => {
    orderRepository.findOneBy = jest.fn().mockResolvedValue({
      id: 1,
      user: { id: 1 },
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return false when user does not match order user', async () => {
    orderRepository.findOneBy = jest.fn().mockResolvedValue({
      id: 1,
      user: { id: 2 },
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should handle exceptions', async () => {
    const error = new Error('Database error');
    orderRepository.findOneBy = jest.fn().mockRejectedValue(error);
    await guard.canActivate(context);
    expect(handlerException.handlerDBException).toHaveBeenCalledWith(error);
  });
});
