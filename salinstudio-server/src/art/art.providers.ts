import { DataSource } from 'typeorm';
import { Art } from './entities/art.entity';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from 'src/config/constants';

export const artProviders = [
  {
    provide: REPOSITORY_NAMES.ART,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Art),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
