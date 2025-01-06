import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty({
    example: '1',
    description: 'Product image ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Product image name',
    example: 'image.jpg',
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ManyToOne(() => Product, (product) => product.images, {
    // onDelete: 'CASCADE',
  })
  product: Product;
}
