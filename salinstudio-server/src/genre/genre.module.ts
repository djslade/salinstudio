import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { genreProviders } from './genre.providers';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

@Module({
  imports: [DatabaseModule],
  providers: [...genreProviders, GenreService],
  controllers: [GenreController],
  exports: [GenreService],
})
export class GenreModule {}
