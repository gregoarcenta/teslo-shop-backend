import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    return {
      type: this.configService.get('DB_TYPE') as any,
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      entities: ['dist/**/*.entity.js'],
      // synchronize: !isProduction,
      synchronize: true,
      ssl: isProduction,
      extra: isProduction ? { rejectUnauthorized: false } : null,
    };
  }
}
