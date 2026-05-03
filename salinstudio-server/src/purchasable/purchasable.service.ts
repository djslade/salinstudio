import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REPOSITORY_NAMES } from '../config/constants';
import { Repository } from 'typeorm';
import { Purchasable } from './entities/purchasable.entity';
import { createPurchasableDto } from './dto/create-purchasable.dto';
import { Art } from '../art/entities/art.entity';
import { Image } from '../image/entities/image.entity';
import { nanoid } from 'nanoid';
import { updatePurchasableDto } from './dto/update-purchasable.dto';
import { ImageService } from '../image/image.service';

@Injectable()
export class PurchasableService {
  constructor(
    @Inject(REPOSITORY_NAMES.PURCHASABLE)
    private purchasableRepository: Repository<Purchasable>,
    private imageService: ImageService,
  ) {}

  async findById(id: string): Promise<Purchasable> {
    const purchasable = await this.purchasableRepository.findOne({
      where: { id },
      relations: {
        images: true,
        art: { image: true, collections: { image: true } },
      },
    });
    if (!purchasable) throw new NotFoundException('Purchasable not found');
    return purchasable;
  }

  async findByNanoId(nanoId: string): Promise<Purchasable> {
    const purchasable = await this.purchasableRepository.findOne({
      where: { nanoId },
      relations: {
        images: true,
        art: { image: true, collections: { image: true } },
      },
    });
    if (!purchasable) throw new NotFoundException('Purchasable not found');
    return purchasable;
  }

  async artIdIsAssigned(artId: string): Promise<void> {
    const purchasable = await this.purchasableRepository.findOne({
      where: { art: { id: artId } },
    });
    if (purchasable) {
      throw new BadRequestException(
        'art is already associated with a store item',
      );
    }
  }

  async findAll(): Promise<Purchasable[]> {
    return await this.purchasableRepository.find({
      relations: {
        images: true,
        art: { image: true, collections: { image: true } },
      },
    });
  }

  async findAllPublic(): Promise<Purchasable[]> {
    return await this.purchasableRepository.find({
      where: { isPublic: true },
      relations: {
        images: true,
        art: { image: true, collections: { image: true } },
      },
    });
  }

  async create(dto: createPurchasableDto, art: Art, images: Image[]) {
    const purchasable = this.purchasableRepository.create();

    // Create and save nanoId
    let nanoId = nanoid(8);
    while (
      (await this.purchasableRepository.find({ where: { nanoId } })).length > 0
    ) {
      nanoId = nanoid(8);
    }
    purchasable.nanoId = nanoId;

    // Strings
    purchasable.titleEn = dto.titleEn;
    purchasable.titleFi = dto.titleFi;
    purchasable.infoEn = dto.infoEn;
    purchasable.infoFi = dto.infoFi;
    purchasable.techniqueEn = dto.techniqueEn;
    purchasable.techniqueFi = dto.techniqueFi;

    // Numbers
    purchasable.height = dto.height;
    purchasable.width = dto.width;
    purchasable.quantity = dto.quantity;
    purchasable.maxPrice = dto.maxPrice;
    purchasable.currentPrice = dto.maxPrice;
    purchasable.year = dto.year;

    // Bools
    purchasable.isPublic = dto.isPublic;
    purchasable.isFramed = dto.isFramed;
    purchasable.isOriginal = dto.isOriginal;
    purchasable.isFeatured = dto.isFeatured;
    purchasable.isOnSale = false;

    // FKs
    purchasable.art = art;
    purchasable.images = images;

    return await this.purchasableRepository.save(purchasable);
  }

  async update(
    id: string,
    dto: updatePurchasableDto,
    art: Art,
    images: Image[],
  ): Promise<void> {
    const purchasable = await this.purchasableRepository.findOne({
      where: { id },
    });
    if (!purchasable) throw new NotFoundException();
    // Strings
    purchasable.titleEn = dto.titleEn;
    purchasable.titleFi = dto.titleFi;
    purchasable.infoEn = dto.infoEn;
    purchasable.infoFi = dto.infoFi;
    purchasable.techniqueEn = dto.techniqueEn;
    purchasable.techniqueFi = dto.techniqueFi;

    // Numbers
    purchasable.height = dto.height;
    purchasable.width = dto.width;
    purchasable.quantity = dto.quantity;
    purchasable.maxPrice = dto.maxPrice;
    purchasable.currentPrice = dto.currentPrice;
    purchasable.year = dto.year;

    // Bools
    purchasable.isPublic = dto.isPublic;
    purchasable.isFramed = dto.isFramed;
    purchasable.isOriginal = dto.isOriginal;
    purchasable.isFeatured = dto.isFeatured;
    purchasable.isOnSale = dto.isOnSale;

    // FKs
    purchasable.art = art;
    purchasable.images = images;

    await this.purchasableRepository.save(purchasable);
  }

  async delete(id: string): Promise<void> {
    const toDelete = await this.findById(id);
    await this.purchasableRepository.delete(id);
    if (toDelete.images.length > 0) {
      for (let image of toDelete.images) {
        if (image.id === toDelete.art.image.id) continue;
        await this.imageService.delete(image.id);
      }
    }
  }
}
