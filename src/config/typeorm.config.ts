import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, '../../.env') });

const isProduction = process.env.NODE_ENV === 'production';

const getDatabaseConfiguration = (): DataSourceOptions => ({
  type: (process.env.DB_TYPE || 'postgres') as any,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'teslo_shop',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  ssl: isProduction,
  extra: isProduction ? { rejectUnauthorized: false } : null,
});

export const dbConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => getDatabaseConfiguration(),
);

export const dataSourceOptions: DataSourceOptions = getDatabaseConfiguration();

export default new DataSource(dataSourceOptions);
