import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { DataSource } from 'typeorm';
import { Flag } from './entities/flag.entity';

export const flagProviders = [
  {
    provide: REPOSITORY_NAMES.COLLECTION,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Flag),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
