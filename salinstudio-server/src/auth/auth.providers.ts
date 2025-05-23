import { DataSource } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';

export const authProviders = [
  {
    provide: REPOSITORY_NAMES.REFRESH_TOKEN,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RefreshToken),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
