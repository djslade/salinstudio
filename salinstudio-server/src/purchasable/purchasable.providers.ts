import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { DataSource } from 'typeorm';
import { Purchasable } from './entities/purchasable.entity';

export const purchasableProviders = [
  {
    provide: REPOSITORY_NAMES.PURCHASABLE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Purchasable),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
