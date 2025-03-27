import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'taskflow-db',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'taskflow_user',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'taskflow_db',
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
};