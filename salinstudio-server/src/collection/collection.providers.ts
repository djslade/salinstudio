import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { DataSource } from 'typeorm';
import { Collection } from './entities/collection.entity';

export const collectionProviders = [
  {
    provide: REPOSITORY_NAMES.COLLECTION,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Collection),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
