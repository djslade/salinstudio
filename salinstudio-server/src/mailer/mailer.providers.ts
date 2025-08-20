import { DataSource } from 'typeorm';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { Mail } from './entities/mail.entity';

export const mailProviders = [
  {
    provide: REPOSITORY_NAMES.MAIL,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Mail),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
