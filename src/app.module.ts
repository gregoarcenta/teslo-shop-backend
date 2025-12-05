import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';
import { CartModule } from './cart/cart.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './modules/auth/auth.module';
import { dbConfig, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    SeedModule,
    ProductsModule,
    FilesModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
