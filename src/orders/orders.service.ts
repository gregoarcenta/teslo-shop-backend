import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HandlerException } from '../common/exceptions/handler.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities';
import { DataSource, Repository } from 'typeorm';
import {
  OrderItemResponseDto,
  OrderPaginationDto,
  OrderResponseDto,
  UpdateOrderDto,
} from './dto';
import { User } from '../auth/entities/user.entity';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/entities';
import { OrderStatus } from './enums/order-status';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly handlerException: HandlerException,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Configurar lock_timeout en la conexión actual
      await queryRunner.query("SET lock_timeout = '15000ms'");

      // Validar stock y reducirlo para cada producto
      for (const item of cart.cartItems) {
        const product = await queryRunner.manager
          .createQueryBuilder(Product, 'product')
          .setLock('pessimistic_write')
          .where('product.id = :id', { id: item.product.id })
          .getOne();

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.product.id} not found.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product "${product.title}". Available: ${product.stock}.`,
          );
        }

        // Reducir el stock
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      // Crear instancias de los items de la orden
      const orderItems = cart.cartItems.map<OrderItem>((item) => {
        return this.orderItemRepository.create({
          product: { id: item.product.id },
          price: item.product.price,
          quantity: item.quantity,
        });
      });

      //Crea instancia de la orden completa
      const order = this.orderRepository.create({
        user,
        items: orderItems,
        totalItems: orderItems.length,
        totalAmount: cart.total,
      });

      // Guarda la orden
      await queryRunner.manager.save(order);

      // Vacia el carrito
      await this.cartService.clearCart(user.id);

      // Confirmar commit
      await queryRunner.commitTransaction();

      return { message: 'Order created', data: await this.findOne(order.id) };
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (
        err.name === 'QueryFailedError' &&
        err.message.includes('lock timeout')
      ) {
        throw new BadRequestException(
          'The product is being processed by another user, please try again.',
        );
      }

      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      )
        throw err;

      this.handlerException.handlerDBException(err);
    } finally {
      await queryRunner.release();
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
  ): Promise<{
    message: string;
    data: { orders: OrderResponseDto[]; totalOrders: number };
  }> {
    orderPagination.limit ??= 5;
    orderPagination.offset ??= 0;

    const { status, offset, limit } = orderPagination;

    try {
      const queryOptions: Partial<Order> = { user };
      if (status) queryOptions.status = status;
      const totalOrders = await this.orderRepository.count({
        where: queryOptions,
      });
      const orders = await this.orderRepository.find({
        where: queryOptions,
        order: { createdAt: { direction: 'DESC' } },
        skip: offset,
        take: limit,
      });

      return {
        message: '',
        data: {
          orders: orders.map<OrderResponseDto>((order) =>
            this.plainOrder(order),
          ),
          totalOrders,
        },
      };
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

  async cancelOrder(orderId: string): Promise<void> {
    const { status, items } = await this.findOne(orderId);

    if (status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order to cancel order with ID ${orderId} doesn't have status pending - actual status: ${status}`,
      );
    }

    // Restaurar stock
    for (const item of items) {
      await this.productsService.updateStock(item.product.id, item.quantity);
    }

    // Cambiar el estado de la orden
    await this.update(orderId, { status: OrderStatus.CANCELLED });
  }

  async successOrder(orderId: string): Promise<void> {
    const { status } = await this.findOne(orderId);

    if (status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Error to success order with ID: ${orderId} doesn't have status pending - actual status: ${status}`,
      );
    }

    await this.update(orderId, {
      status: OrderStatus.DELIVERED,
      paid: true,
      paidAt: new Date(),
    });
  }

  plainOrder(order: Order): OrderResponseDto {
    return {
      id: order.id,
      createdAt: order.createdAt,
      userEmail: order.user.email,
      status: order.status,
      paid: order.paid,
      paidAt: order.paidAt,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      items: order.items.map((item) => this.plainOrderItem(item)),
    };
  }

  plainOrderItem(orderItem: OrderItem): OrderItemResponseDto {
    return {
      id: orderItem.id,
      quantity: orderItem.quantity,
      price: orderItem.price,
      product: {
        id: orderItem.product.id,
        title: orderItem.product.title,
      },
    };
  }
}
