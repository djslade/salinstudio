import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_NAMES } from 'src/config/constants';
import { Repository } from 'typeorm';
import { Art, ArtCategory } from './entities/art.entity';
import { UploadService } from 'src/upload/upload.service';
import { ImageService } from 'src/image/image.service';
import { ConfigService } from '@nestjs/config';
import { OrderCategoryDto } from './dto/order-category.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { OrderAllDto } from './dto/order-all.dto';

type CreateArtParams = {
  fullUrl: string;
  desktopUrl: string;
  mobileUrl: string;
  thumbUrl: string;
  titleEn: string;
  titleFi: string;
  descriptionEn: string;
  descriptionFi: string;
  category: ArtCategory;
  fingerprintChecksum: number;
};

@Injectable()
export class ArtService {
  constructor(
    @Inject(REPOSITORY_NAMES.ART)
    private artRepository: Repository<Art>,
    private uploadService: UploadService,
    private imageService: ImageService,
    private configService: ConfigService,
  ) {}

  async findArtById(id: string): Promise<Art> {
    const art = await this.artRepository.findOne({ where: { id } });
    if (!art) throw new NotFoundException('Art not found');
    return art;
  }

  async findAll(): Promise<Art[]> {
    return await this.artRepository.find({ order: {} });
  }

  async handleImage(image: Buffer) {
    const processedImages = await this.imageService.processImage(image);
    await this.uploadService.upload(
      `full/${processedImages.name}.webp`,
      processedImages.full,
    );
    await this.uploadService.upload(
      `desktop/${processedImages.name}.webp`,
      processedImages.desktop,
    );
    await this.uploadService.upload(
      `mobile/${processedImages.name}.webp`,
      processedImages.mobile,
    );
    await this.uploadService.upload(
      `thumb/${processedImages.name}.webp`,
      processedImages.thumb,
    );
    const domain = this.configService.getOrThrow('AWS_CF_DOMAIN');
    return {
      fullUrl: `${domain}/full/${processedImages.name}.webp`,
      desktopUrl: `${domain}/desktop/${processedImages.name}.webp`,
      mobileUrl: `${domain}/mobile/${processedImages.name}.webp`,
      thumbUrl: `${domain}/thumb/${processedImages.name}.webp`,
      fingerprintChecksum: processedImages.fingerprintChecksum,
    };
  }

  async createArt(params: CreateArtParams): Promise<Art> {
    const art = this.artRepository.create();
    const totalIndex = await this.artRepository.count();
    const categoryIndex = await this.artRepository.count({
      where: { category: params.category },
    });
    art.fullUrl = params.fullUrl;
    art.desktopUrl = params.desktopUrl;
    art.mobileUrl = params.mobileUrl;
    art.thumbUrl = params.thumbUrl;
    art.titleEn = params.titleEn;
    art.titleFi = params.titleFi;
    art.descriptionEn = params.descriptionEn;
    art.descriptionFi = params.descriptionFi;
    art.category = params.category;
    art.fingerprintChecksum = params.fingerprintChecksum;
    art.totalIndex = totalIndex;
    art.categoryIndex = categoryIndex;
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

  async update(id: string, body: UpdateArtDto): Promise<void> {
    await this.artRepository.update({ id }, { ...body });
  }

  async delete(id: string): Promise<void> {
    const { totalIndex, categoryIndex, category } = await this.findArtById(id);
    const allArt = await this.findAll();
    for (let art of allArt) {
      if (art.totalIndex > totalIndex) {
        art.totalIndex--;
      }
      if (art.category === category && art.categoryIndex > categoryIndex) {
        art.categoryIndex--;
      }
      await this.artRepository.save(art);
    }
    await this.artRepository.delete(id);
  }
}
