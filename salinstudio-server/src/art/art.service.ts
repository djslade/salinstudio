import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ART_MAX_IMAGES, REPOSITORY_NAMES } from '../config/constants';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Art, ArtCategory } from './entities/art.entity';
import { ImageService } from '../image/image.service';
import { OrderCategoryDto } from './dto/order-category.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { OrderAllDto } from './dto/order-all.dto';
import { OrderCarouselDto } from './dto/order-carousel.dto';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { Image } from '../image/entities/image.entity';
import { CollectionService } from '../collection/collection.service';
import { Collection } from '../collection/entities/collection.entity';

type CreateArtParams = {
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  category: ArtCategory;
  // Ordered; the first image becomes the lead image.
  images: Image[];
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
      relations: { image: true, images: true, collections: { image: true } },
      order: { images: { galleryIndex: 'ASC' } },
    });
    if (!art) throw new NotFoundException('Art not found');
    return art;
  }

  async findArtBySlug(slug: string): Promise<Art> {
    const art = await this.artRepository.findOne({
      where: { slug },
      relations: { image: true, images: true, collections: { image: true } },
      order: { images: { galleryIndex: 'ASC' } },
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
    if (params.images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    if (params.images.length > ART_MAX_IMAGES) {
      throw new BadRequestException(
        `An artwork can have at most ${ART_MAX_IMAGES} images`,
      );
    }
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
    art.image = params.images[0];
    const saved = await this.artRepository.save(art);
    await this.imageService.assignToArt(
      saved.id,
      params.images.map((image) => image.id),
    );
    return await this.findArtById(saved.id);
  }

  // Returns the artwork's images in order. Falls back to the lead image for
  // rows that somehow have no image list.
  getOrderedImages(art: Art): Image[] {
    if (art.images && art.images.length > 0) {
      return [...art.images].sort((a, b) => a.galleryIndex - b.galleryIndex);
    }
    return art.image ? [art.image] : [];
  }

  async assertCanAddImages(id: string, count: number): Promise<Art> {
    const art = await this.findArtById(id);
    const current = this.getOrderedImages(art).length;
    if (count < 1) throw new BadRequestException('No images were uploaded');
    if (current + count > ART_MAX_IMAGES) {
      throw new BadRequestException(
        `An artwork can have at most ${ART_MAX_IMAGES} images`,
      );
    }
    return art;
  }

  async addImages(id: string, images: Image[]): Promise<Art> {
    const art = await this.assertCanAddImages(id, images.length);
    const ordered = [...this.getOrderedImages(art), ...images];
    await this.imageService.assignToArt(
      art.id,
      ordered.map((image) => image.id),
    );
    return await this.findArtById(art.id);
  }

  // `ids` must contain exactly the artwork's current images, in the new order.
  // The first id becomes the lead image.
  async reorderImages(id: string, ids: string[]): Promise<Art> {
    const art = await this.findArtById(id);
    const current = this.getOrderedImages(art);
    const currentIds = new Set(current.map((image) => image.id));
    const isPermutation =
      ids.length === current.length &&
      new Set(ids).size === ids.length &&
      ids.every((imageId) => currentIds.has(imageId));
    if (!isPermutation) {
      throw new BadRequestException(
        "Image order must list each of the artwork's images exactly once",
      );
    }
    await this.imageService.assignToArt(art.id, ids);
    const lead = current.find((image) => image.id === ids[0]);
    if (art.image?.id !== lead.id) {
      await this.artRepository.update({ id: art.id }, { image: lead });
    }
    return await this.findArtById(art.id);
  }

  async removeImage(id: string, imageId: string): Promise<Art> {
    const art = await this.findArtById(id);
    const current = this.getOrderedImages(art);
    if (!current.some((image) => image.id === imageId)) {
      throw new NotFoundException('Image does not belong to this artwork');
    }
    if (current.length === 1) {
      throw new BadRequestException('An artwork must keep at least one image');
    }
    const remaining = current.filter((image) => image.id !== imageId);
    // Point the artwork at its new lead before deleting, since art.imageId
    // has a foreign key to the image being removed.
    if (art.image?.id !== remaining[0].id) {
      await this.artRepository.update({ id: art.id }, { image: remaining[0] });
    }
    await this.imageService.assignToArt(
      art.id,
      remaining.map((image) => image.id),
    );
    await this.imageService.delete(imageId);
    return await this.findArtById(art.id);
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
    for (const id of body.collections) {
      const collection = await this.collectionService.getCollectionById(id);
      collections.push(collection);
    }
    art.collections = collections;
    await this.artRepository.save(art);
  }

  async delete(id: string): Promise<void> {
    const artToDelete = await this.findArtById(id);
    const allArt = await this.findAll();
    for (const art of allArt) {
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
    const imageIds = new Set(
      this.getOrderedImages(artToDelete).map((image) => image.id),
    );
    if (artToDelete.image) imageIds.add(artToDelete.image.id);
    for (const imageId of imageIds) await this.imageService.delete(imageId);
  }

  async findPrevAndNext(index: number) {
    // Looking for art where index = param+1 might cause issues.
    // Instead, will look for closest.
    const allArtOrdered = await this.artRepository.find({
      order: { totalIndex: 'ASC' },
    });
    const allPrevArt = await this.artRepository.find({
      where: { totalIndex: MoreThan(index) },
      order: { totalIndex: 'ASC' },
    });
    const allNextArt = await this.artRepository.find({
      where: { totalIndex: LessThan(index) },
      order: { totalIndex: 'DESC' },
    });
    const prev = allPrevArt.length > 0 ? allPrevArt[0] : allArtOrdered[0];
    const next =
      allNextArt.length > 0
        ? allNextArt[0]
        : allArtOrdered[allArtOrdered.length - 1];
    return { nextSlug: next.slug, prevSlug: prev.slug };
  }
}
