import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { REPOSITORY_NAMES } from '../config/constants';
import { ImageService } from '../image/image.service';
import { CreateCollectionDto } from './dtos/create-collection.dto';
import { Image } from '../image/entities/image.entity';
import { UpdateCollectionDto } from './dtos/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @Inject(REPOSITORY_NAMES.COLLECTION)
    private collectionRepository: Repository<Collection>,
    private imageService: ImageService,
  ) {}

  async createCollection(params: CreateCollectionDto, image: Image) {
    const collection = this.collectionRepository.create();
    collection.titleEn = params.titleEn;
    collection.titleFi = params.titleFi;
    collection.descriptionEn = params.descriptionEn;
    collection.descriptionFi = params.descriptionFi;
    collection.image = image;
    return await this.collectionRepository.save(collection);
  }

  async getCollectionById(id: string) {
    const collection = await this.collectionRepository.findOne({
      where: { id },
      relations: { image: true, art: { image: true } },
    });
    if (!collection) throw new NotFoundException();
    return collection;
  }

  async getAllCollections() {
    return await this.collectionRepository.find({
      relations: { image: true, art: { image: true } },
    });
  }

  async getCollectionsByArtId(artId: number) {
    return await this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.image', 'collectionImage')
      .leftJoinAndSelect('collection.art', 'art')
      .leftJoinAndSelect('art.image', 'artImage')
      .where('art.id = :artId', { artId })
      .getMany();
  }

  async updateCollection(id: string, params: UpdateCollectionDto) {
    await this.collectionRepository.update({ id }, { ...params });
  }

  async deleteCollection(id: string) {
    const collection = await this.getCollectionById(id);
    await this.collectionRepository.delete(id);
    await this.imageService.delete(collection.image.id);
  }
}
