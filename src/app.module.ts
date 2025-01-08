import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService, validationSchema } from './config';
import { SeedModule } from './seed/seed.module';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    SeedModule,
    ProductsModule,
    FilesModule,
    CartModule,
  ],
})
export class AppModule {}
