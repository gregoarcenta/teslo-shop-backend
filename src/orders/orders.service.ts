import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities';
import { Repository } from 'typeorm';
import {
  OrderItemResponseDto,
  OrderPaginationDto,
  OrderResponseDto,
  UpdateOrderDto,
} from './dto';
import { User } from '../auth/entities/user.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly handlerException: HandlerException,
    private readonly cartService: CartService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(
    user: User,
  ): Promise<{ message: string; data: OrderResponseDto }> {
    const cart = await this.cartService.getCart(user.id);

    if (cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItems = cart.cartItems.map<OrderItem>((item) => {
      return this.orderItemRepository.create({
        product: { id: item.product.id },
        price: item.product.price,
        quantity: item.quantity,
      });
    });

    const order = this.orderRepository.create({
      user,
      items: orderItems,
      totalItems: orderItems.length,
      totalAmount: cart.total,
    });

    try {
      await this.orderRepository.save(order);
      await this.cartService.clearCart(user.id);
      return { message: 'Order created', data: await this.findOne(order.id) };
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findAll(
    orderPagination: OrderPaginationDto,
  ): Promise<OrderResponseDto[]> {
    orderPagination.limit ??= 5;
    orderPagination.offset ??= 0;

    const { status, offset, limit } = orderPagination;

    const queryOptions: Partial<Order> = {};
    if (status) queryOptions.status = status;

    try {
      const orders = await this.orderRepository.find({
        where: queryOptions,
        order: { createdAt: { direction: 'DESC' } },
        skip: offset,
        take: limit,
      });

      return orders.map<OrderResponseDto>((order) => this.plainOrder(order));
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findAllByUser(
    orderPagination: OrderPaginationDto,
    user: User,
  ): Promise<OrderResponseDto[]> {
    orderPagination.limit ??= 5;
    orderPagination.offset ??= 0;

    const { status, offset, limit } = orderPagination;

    try {
      const queryOptions: Partial<Order> = { user };
      if (status) queryOptions.status = status;

      const orders = await this.orderRepository.find({
        where: queryOptions,
        order: { createdAt: { direction: 'DESC' } },
        skip: offset,
        take: limit,
      });

      return orders.map<OrderResponseDto>((order) => this.plainOrder(order));
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    let order: Order;
    try {
      order = await this.orderRepository.findOne({ where: { id } });
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    return this.plainOrder(order);
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<{ message: string; data: OrderResponseDto }> {
    let order: Order = null;
    try {
      order = await this.orderRepository.preload({
        id,
        ...updateOrderDto,
      });
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    try {
      await this.orderRepository.save(order);
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    return { message: 'Order updated', data: await this.findOne(order.id) };
  }

  private plainOrder(order: Order): OrderResponseDto {
    return {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      paid: order.paid,
      paidAt: order.paidAt,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      items: order.items.map((item) => this.plainOrderItem(item)),
    };
  }

  private plainOrderItem(orderItem: OrderItem): OrderItemResponseDto {
    return {
      id: orderItem.id,
      quantity: orderItem.quantity,
      price: orderItem.price,
      product: {
        id: orderItem.id,
        title: orderItem.product.title,
      },
    };
  }
}
