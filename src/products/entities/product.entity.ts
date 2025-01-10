import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product-image.entity';
import { Gender, Size, Type } from '../enums';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    description: 'Product ID',
    example: 'a147db81-1eab-462e-9dd9-c086131c191f',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: 'T-shirt Teslo',
    uniqueItems: true,
  })
  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @ApiProperty({
    description: 'Product slug',
    example: 't-shirt-teslo',
    uniqueItems: true,
  })
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'lorem ipsum dolor sit amet',
    default: null,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 10.99,
    default: 0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiPropertyOptional({
    description: 'Product stock',
    example: 10,
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ description: 'Product type', enum: Type })
  @Column({ type: 'enum', enum: Type })
  type: Type;

  @ApiProperty({ description: 'Product gender', enum: Gender })
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: 'Product sizes', enum: Size, isArray: true })
  @Column({ type: 'enum', enum: Size, array: true })
  sizes: Size[];

  @ApiPropertyOptional({
    description: 'Product tags',
    isArray: true,
    type: 'string',
    example: ['shirt'],
    default: [],
  })
  @Column({ type: 'varchar', length: 20, array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product images',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ApiProperty({
    description: 'Product created at',
    example: '2024-11-08T22:51:11.862Z',
  })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
