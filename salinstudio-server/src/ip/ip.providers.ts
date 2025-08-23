import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { DataSource } from 'typeorm';
import { LookupThrottle } from './entities/lookup-throttle.entity';

export const ipProviders = [
  {
    provide: REPOSITORY_NAMES.LOOKUP_THROTTLE,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LookupThrottle),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
