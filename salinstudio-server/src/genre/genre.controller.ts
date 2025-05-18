import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dtos/create-genre.dto';

@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}
  @Get()
  async getAllGenres() {
    const genres = await this.genreService.findAll();
    return { message: 'OK', genres };
  }

  @Get(':id')
  async getGenre(@Param('id') id: string) {
    const genre = await this.genreService.findById(id);

    return { message: 'OK', genre };
  }

  @Post()
  async createGenre(@Body() body: CreateGenreDto) {
    const genre = await this.genreService.create(body.nameEn, body.nameFi);
    return { message: 'Created', genre };
  }
}
