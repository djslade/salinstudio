import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { DataSource } from 'typeorm';
import { Visitor } from './entities/visitor.entity';

export const visitorProviders = [
  {
    provide: REPOSITORY_NAMES.VISITOR,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Visitor),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
