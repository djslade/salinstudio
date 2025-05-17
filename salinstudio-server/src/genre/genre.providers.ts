import { DataSource } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from 'src/config/constants';

export const genreProviders = [
  {
    provide: REPOSITORY_NAMES.GENRE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Genre),
    inject: [DATABASE_CONFIG.PROVIDER_NAME],
  },
];
