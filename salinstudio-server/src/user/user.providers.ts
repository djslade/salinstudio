import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';

export const userProviders = [
  {
    provide: REPOSITORY_NAMES.USER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
