import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Product } from '../../products/entities';
import { User } from '../../modules/auth/entities/user.entity';

@Entity('favorites')
@Unique(['user', 'product'])
export class Favorite {
  @ApiProperty({
    description: 'Favorite ID',
    example: 'a147db81-1eab-462e-9dd9-c086131c191f',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Favorite user', type: User })
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Favorite product', type: Product })
  @ManyToOne(() => Product, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
