import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { REPOSITORY_NAMES } from '../config/constants';
import { Repository } from 'typeorm';
import { Art, ArtCategory } from './entities/art.entity';
import { UploadService } from '../upload/upload.service';
import { ImageService } from '../image/image.service';
import { ConfigService } from '@nestjs/config';
import { OrderCategoryDto } from './dto/order-category.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { OrderAllDto } from './dto/order-all.dto';
import { OrderCarouselDto } from './dto/order-carousel.dto';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

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

  generateSlug(title: string): string {
    const base = slugify(title, { lower: true, strict: true });
    const id = nanoid(6);
    return `${base}-${id}`;
  }

  async findArtById(id: string): Promise<Art> {
    const art = await this.artRepository.findOne({ where: { id } });
    if (!art) throw new NotFoundException('Art not found');
    return art;
  }

  async findArtBySlug(slug: string): Promise<Art> {
    const art = await this.artRepository.findOne({ where: { slug } });
    if (!art) throw new NotFoundException('Art not found');
    return art;
  }

  async findAll(): Promise<Art[]> {
    return await this.artRepository.find({ order: { totalIndex: 'DESC' } });
  }

  async findHomeCarouselArt(): Promise<Art[]> {
    return await this.artRepository.find({ where: { onHomeCarousel: true } });
  }

  async handleImage(image: Buffer) {
    try {
      const processedImages = await this.imageService.processImage(image);
      const fileNames = this.imageService.getFileNames();
      const domain = this.configService.getOrThrow('AWS_CF_DOMAIN');

      await this.uploadService.upload(fileNames.fullUrl, processedImages.full);
      await this.uploadService.upload(
        fileNames.desktopUrl,
        processedImages.desktop,
      );
      await this.uploadService.upload(
        fileNames.mobileUrl,
        processedImages.mobile,
      );
      await this.uploadService.upload(
        fileNames.thumbUrl,
        processedImages.thumb,
      );

      return {
        fullUrl: `${domain}/${fileNames.fullUrl}`,
        desktopUrl: `${domain}/${fileNames.desktopUrl}`,
        mobileUrl: `${domain}/${fileNames.mobileUrl}`,
        thumbUrl: `${domain}/${fileNames.thumbUrl}`,
        fingerprintChecksum: processedImages.fingerprintChecksum,
      };
    } catch (err) {
      if (err.message.includes('VipsJpeg')) {
        throw new UnprocessableEntityException(
          'This file is corrupt and cannot be processed',
        );
      }
      throw new InternalServerErrorException(
        'Could not process images at this time',
      );
    }
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
    art.updatedFingerprint = true;
    art.slug = this.generateSlug(params.titleEn);
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
    await this.artRepository.update({ id }, { ...body });
  }

  async delete(id: string): Promise<void> {
    const artToDelete = await this.findArtById(id);
    const urls = [
      artToDelete.fullUrl,
      artToDelete.desktopUrl,
      artToDelete.mobileUrl,
      artToDelete.thumbUrl,
    ];
    for (let url of urls) await this.uploadService.delete(url);
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
  }

  async checkFingerprint(image: Buffer) {
    const config = await this.imageService.extractFingerprint(image);
    if (!config) throw new BadRequestException('Could not verify fingerprint');
    return config.checksum;
  }

  async findArtByChecksum(checksum: number): Promise<Art[]> {
    return await this.artRepository.find({
      where: { fingerprintChecksum: checksum },
    });
  }

  async updateFingerprint() {
    const domain = this.configService.getOrThrow('AWS_CF_DOMAIN');
    const outdatedArt = await this.artRepository.find({
      where: { updatedFingerprint: false },
    });
    if (outdatedArt.length === 0) {
      return;
    }
    for (let art of outdatedArt) {
      const date = art.createdAt;
      const image = await this.uploadService.get(
        art.fullUrl.replace(`${domain}/`, ''),
      );
      if (!image) {
        console.error('skipped over ' + art.id);
        continue;
      }
      const fingerprint = await this.imageService.extractFingerprint(image);
      if (fingerprint) {
        const matches = await this.findArtByChecksum(fingerprint.checksum);
        if (matches.filter((m) => m.id === art.id).length > 0) {
          art.updatedFingerprint = true;
          await this.artRepository.save(art);
          continue;
        }
      }
      const newImages = await this.imageService.processImage(image, date);
      await this.uploadService.upload(
        art.fullUrl.replace(`${domain}/`, ''),
        newImages.full,
      );
      await this.uploadService.upload(
        art.desktopUrl.replace(`${domain}/`, ''),
        newImages.desktop,
      );
      await this.uploadService.upload(
        art.mobileUrl.replace(`${domain}/`, ''),
        newImages.mobile,
      );
      await this.uploadService.upload(
        art.thumbUrl.replace(`${domain}/`, ''),
        newImages.thumb,
      );
      art.fingerprintChecksum = newImages.fingerprintChecksum;
      art.updatedFingerprint = true;
      await this.artRepository.save(art);
    }
  }
}
