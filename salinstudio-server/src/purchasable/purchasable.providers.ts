import { DATABASE_CONFIG, REPOSITORY_NAMES } from 'src/config/constants';
import { DataSource } from 'typeorm';

export const purchasableProviders = [
  {
    provide: REPOSITORY_NAMES.PURCHASABLE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
