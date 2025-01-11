import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status';
import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-items.entity';

@Entity('orders')
export class Order {
  @ApiProperty({
    description: 'Order ID',
    example: '9b12083a-5fe9-403b-80f9-6906adee303e',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Order total amount', example: '10.00' })
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: string;

  @ApiProperty({ description: 'Order total items', example: 1 })
  @Column({ type: 'int', name: 'total_items' })
  totalItems: number;

  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Order paid',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @ApiProperty({
    description: 'Order paid at',
    example: '2024-11-08T22:51:11.862Z',
    default: null,
  })
  @Column({
    type: 'timestamptz',
    name: 'paid_at',
    default: null,
    nullable: true,
  })
  paidAt: Date;

  @ApiProperty({ description: 'Order user', type: User })
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Order items', type: [OrderItem] })
  @OneToMany(() => OrderItem, (item) => item.order, {
    eager: true,
    cascade: true,
  })
  items: OrderItem[];

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
