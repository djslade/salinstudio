import { DATABASE_CONFIG } from '../config/constants';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_CONFIG.HOST,
  port: DATABASE_CONFIG.PORT,
  username: DATABASE_CONFIG.USERNAME,
  password: DATABASE_CONFIG.PASSWORD,
  database: DATABASE_CONFIG.DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: DATABASE_CONFIG.SYNCHRONIZE,
  migrationsRun: DATABASE_CONFIG.MIGRATIONS_RUN,
});

export const databaseProviders = [
  {
    provide: DATABASE_CONFIG.PROVIDER_NAME,
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
