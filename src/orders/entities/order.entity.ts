import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status';
import { User } from '../../auth/entities/user.entity';

@Entity('orders')
export class Order {
  @ApiProperty({
    description: 'Order ID',
    example: '1234567890',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Order total',
    example: 10.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.DELIVERED,
  })
  @Column({ type: 'enum', enum: OrderStatus })
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

  @ApiProperty({
    description: 'Order user',
    type: User,
  })
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: User;

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
