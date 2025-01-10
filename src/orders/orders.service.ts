import { Injectable, NotFoundException } from '@nestjs/common';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from './dto';
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

  findAll() {
    return `This action returns all orders`;
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
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
