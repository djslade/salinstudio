import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { DataSource } from 'typeorm';
import { Image } from './entities/image.entity';

export const imageProviders = [
  {
    provide: REPOSITORY_NAMES.IMAGE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Image),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
