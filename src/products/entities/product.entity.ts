import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    description: 'Product description',
    example: 'lorem ipsum dolor sit amet',
    default: null,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 10.99,
    default: 0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ description: 'Product type', example: 'shirts' })
  @Column({ type: 'enum', enum: Type })
  type: Type;

  @ApiProperty({ description: 'Product gender', example: 'men' })
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @ApiProperty({ example: ['M', 'XL', 'XXL'], description: 'Product sizes' })
  @Column({ type: 'enum', enum: Size, array: true })
  sizes: Size[];

  @ApiProperty({
    description: 'Product tags',
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
  createdBy: User;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    description: 'Product created at',
    example: '2024-11-08T22:51:11.862Z',
  })
  created_at: Date;
}
