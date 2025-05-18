import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_NAMES } from 'src/config/constants';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @Inject(REPOSITORY_NAMES.GENRE)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(nameEn: string, nameFi: string) {
    const genre = this.genreRepository.create();
    genre.nameEn = nameEn;
    genre.nameFi = nameFi;
    return await this.genreRepository.save(genre);
  }

  async findById(id: string) {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }
  async findAll() {
    return await this.genreRepository.find();
  }

  async findAllWithArt() {
    return await this.genreRepository.find({
      relations: { art: true },
      order: { art: { createdAt: 'DESC' } },
    });
  }

  async findByNameEn(nameEn: string) {
    return await this.genreRepository.findOne({ where: { nameEn } });
  }

  async findByNameFi(nameFi: string) {
    return await this.genreRepository.findOne({ where: { nameFi } });
  }

  async findByNameEnOrThrow(nameEn: string) {
    const genre = await this.findByNameEn(nameEn);
    if (!genre)
      throw new NotFoundException(`Could not find genre named ${nameEn}`);
    return genre;
  }

  async findByNameFiOrThrow(nameFi: string) {
    const genre = await this.findByNameFi(nameFi);
    if (!genre)
      throw new NotFoundException(`Could not find genre named ${nameFi}`);
    return genre;
  }

  async update(id: string, nameEn: string, nameFi: string) {
    await this.genreRepository.update({ id }, { nameEn, nameFi });
  }

  async delete(id: string) {
    await this.genreRepository.delete({ id });
  }
}
