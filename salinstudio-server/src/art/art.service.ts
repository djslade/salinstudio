import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_NAMES } from '../config/constants';
import { Repository } from 'typeorm';
import { Art, ArtCategory } from './entities/art.entity';
import { ImageService } from '../image/image.service';
import { OrderCategoryDto } from './dto/order-category.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { OrderAllDto } from './dto/order-all.dto';
import { OrderCarouselDto } from './dto/order-carousel.dto';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { Image } from 'src/image/entities/image.entity';
import { CollectionService } from 'src/collection/collection.service';
import { Collection } from 'src/collection/entities/collection.entity';

type CreateArtParams = {
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  category: ArtCategory;
  image: Image;
};

@Injectable()
export class ArtService {
  constructor(
    @Inject(REPOSITORY_NAMES.ART)
    private artRepository: Repository<Art>,
    private imageService: ImageService,
    private collectionService: CollectionService,
  ) {}

  generateSlug(title: string): string {
    const base = slugify(title, { lower: true, strict: true });
    const id = nanoid(6);
    return `${base}-${id}`;
  }

  async findArtById(id: string): Promise<Art> {
    const art = await this.artRepository.findOne({
      where: { id },
      relations: { image: true, collections: { image: true } },
    });
    if (!art) throw new NotFoundException('Art not found');
    return art;
  }

  async findArtBySlug(slug: string): Promise<Art> {
    const art = await this.artRepository.findOne({
      where: { slug },
      relations: { image: true, collections: { image: true } },
    });
    if (!art) throw new NotFoundException('Art not found');
    return art;
  }

  async findAll(): Promise<Art[]> {
    return await this.artRepository.find({
      relations: { image: true, collections: { image: true } },
      order: { totalIndex: 'DESC' },
    });
  }

  async findHomeCarouselArt(): Promise<Art[]> {
    return await this.artRepository.find({
      where: { onHomeCarousel: true },
      relations: { image: true },
    });
  }

  async createArt(params: CreateArtParams): Promise<Art> {
    const art = this.artRepository.create();
    const totalIndex = await this.artRepository.count();
    const categoryIndex = await this.artRepository.count({
      where: { category: params.category },
    });
    art.titleEn = params.titleEn;
    art.titleFi = params.titleFi;
    art.descriptionEn = params.descriptionEn;
    art.descriptionFi = params.descriptionFi;
    art.category = params.category;
    art.totalIndex = totalIndex;
    art.categoryIndex = categoryIndex;
    art.updatedFingerprint = true;
    art.slug = this.generateSlug(params.titleEn);
    art.image = params.image;
    return await this.artRepository.save(art);
  }

  async updateCategoryOrder(body: OrderCategoryDto) {
    for (let i = 0; i < body.ids.length; i++) {
      await this.artRepository.update(
        { id: body.ids[i] },
        { categoryIndex: i },
      );
    }
  }

  async updateAllOrder(body: OrderAllDto) {
    for (let i = 0; i < body.ids.length; i++) {
      await this.artRepository.update({ id: body.ids[i] }, { totalIndex: i });
    }
  }

  async updateCarouselOrder(body: OrderCarouselDto) {
    for (let i = 0; i < body.ids.length; i++) {
      await this.artRepository.update(
        { id: body.ids[i] },
        { homeCarouselIndex: i },
      );
    }
  }

  async update(id: string, body: UpdateArtDto): Promise<void> {
    const art = await this.artRepository.findOne({ where: { id } });
    if (!art) throw new NotFoundException();
    art.category = body.category;
    art.titleEn = body.titleEn;
    art.titleFi = body.titleFi;
    art.descriptionEn = body.descriptionEn;
    art.descriptionFi = body.descriptionFi;
    const collections: Collection[] = [];
    for (let id of body.collections) {
      const collection = await this.collectionService.getCollectionById(id);
      collections.push(collection);
    }
    art.collections = collections;
    await this.artRepository.save(art);
  }

  async delete(id: string): Promise<void> {
    const artToDelete = await this.findArtById(id);
    const allArt = await this.findAll();
    for (let art of allArt) {
      if (art.totalIndex > artToDelete.totalIndex) {
        art.totalIndex--;
      }
      if (
        art.category === artToDelete.category &&
        art.categoryIndex > artToDelete.categoryIndex
      ) {
        art.categoryIndex--;
      }
      await this.artRepository.save(art);
    }
    await this.artRepository.delete(id);
    await this.imageService.delete(artToDelete.image.id);
  }
}
