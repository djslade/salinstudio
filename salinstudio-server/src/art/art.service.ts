import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_NAMES } from 'src/config/constants';
import { Repository } from 'typeorm';
import { Art } from './entities/art.entity';

@Injectable()
export class ArtService {
  constructor(
    @Inject(REPOSITORY_NAMES.ART)
    private artRepository: Repository<Art>,
  ) {}

  async findArtById(id: string): Promise<Art> {
    const art = await this.artRepository.findOne({ where: { id } });
    if (!art) throw new NotFoundException('Art not found');
    return art;
  }

  async findAll(): Promise<Art[]> {
    return await this.artRepository.find();
  }

  async createArt(
    imageUrl: string,
    titleEn: string,
    titleFi: string,
    descriptionEn: string,
    descriptionFi: string,
  ): Promise<Art> {
    const art = this.artRepository.create();
    art.imageUrl = imageUrl;
    art.titleEn = titleEn;
    art.titleFi = titleFi;
    art.descriptionEn = descriptionEn;
    art.descriptionFi = descriptionFi;
    await this.artRepository.save(art);
    return art;
  }
}
