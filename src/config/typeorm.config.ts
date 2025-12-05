import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

const getDatabaseConfiguration = (): DataSourceOptions => ({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  // synchronize: !isProduction,
  // ssl: isProduction,
  // extra: isProduction ? { rejectUnauthorized: false } : null,
});

export const dbConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    ...getDatabaseConfiguration(),
  }),
);

export const dataSourceOptions: DataSourceOptions = {
  ...getDatabaseConfiguration(),
};

export default new DataSource(dataSourceOptions);
