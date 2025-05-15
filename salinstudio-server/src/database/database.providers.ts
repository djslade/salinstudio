import { DATABASE_CONFIG } from 'src/config/constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: DATABASE_CONFIG.PROVIDER_NAME,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: DATABASE_CONFIG.HOST,
        port: DATABASE_CONFIG.PORT,
        username: DATABASE_CONFIG.USERNAME,
        password: DATABASE_CONFIG.PASSWORD,
        database: DATABASE_CONFIG.DATABASE,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: DATABASE_CONFIG.SYNCHRONIZE,
      });

      return dataSource.initialize();
    },
  },
];
