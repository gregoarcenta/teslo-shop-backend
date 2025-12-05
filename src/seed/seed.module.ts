import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../modules/auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, ProductsModule],
})
export class SeedModule {}
