import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from '../../products/entities';

@Entity('orders-items')
export class OrderItems {
  @ApiProperty({
    description: 'Order item ID',
    example: '9b12083a-5fe9-403b-80f9-6906adee303e',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Order item order_id',
    type: Order,
  })
  @ManyToOne(() => Order, (order) => order.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({
    description: 'Order item product_id',
    type: Product,
  })
  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({
    description: 'Order item quantity',
    example: 2,
  })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({
    description: 'Order item price',
    example: '10.99',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @ApiProperty({
    description: 'Order created at',
    example: '2024-11-08T22:51:11.862Z',
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Order updated at',
    example: '2024-11-08T22:51:11.862Z',
  })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
