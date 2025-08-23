import { DataSource } from 'typeorm';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { Action } from './entities/action.entity';

export const actionProviders = [
  {
    provide: REPOSITORY_NAMES.EVENT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Action),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
