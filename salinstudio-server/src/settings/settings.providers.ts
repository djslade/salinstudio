import { DataSource } from 'typeorm';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { Setting } from './entities/setting.entity';

export const settingProviders = [
  {
    provide: REPOSITORY_NAMES.SETTING,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Setting),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
