import { User } from '../../auth/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @ApiProperty({
    description: 'Cart id',
    example: '550e8400-e29b-41d4-a716-446655440000',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Cart user',
    type: User,
  })
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'Cart items',
    type: [CartItem],
  })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
  cartItems: CartItem[];

  @ApiProperty({
    description: 'Cart created at',
    example: '2024-11-08T22:51:11.862Z',
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Cart updated at',
    example: '2024-11-08T22:51:11.862Z',
  })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
