import { Injectable, NotFoundException } from '@nestjs/common';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities';
import { Repository } from 'typeorm';
import { CreateOrderDto, OrderPaginationDto, UpdateOrderDto } from './dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly handlerException: HandlerException,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const order = this.orderRepository.create({ ...createOrderDto, user });
    try {
      await this.orderRepository.save(order);

      return await this.findOne(order.id);
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findAll(orderPagination: OrderPaginationDto) {
    orderPagination.limit ??= 5;
    orderPagination.offset ??= 0;

    const { status, offset, limit } = orderPagination;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    try {
      if (status) {
        queryBuilder.where('order.status = :status', { status });
      }

      return await queryBuilder
        .skip(offset)
        .take(limit)
        .orderBy('order.created_at', 'DESC')
        .getMany();
    } catch (error) {
      this.handlerException.handlerDBException(error);
    }
  }

  async findOne(id: string): Promise<Order> {
    let order: Order;
    try {
      order = await this.orderRepository.findOne({ where: { id } });
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    // let order: Order = await this.findOne(id);
    // try {
    //   order = await this.ordersRepository.preload({
    //     ...order,
    //     ...updateOrderDto,
    //   });
    //   await this.ordersRepository.save(order);
    // } catch (error) {
    //   this.handlerException.handlerDBException(error);
    // }
    // return order;
  }
}
