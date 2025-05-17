import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_NAMES } from 'src/config/constants';
import { Repository } from 'typeorm';
import { Art } from './entities/art.entity';
import { UploadService } from 'src/upload/upload.service';
import { ImageService } from 'src/image/image.service';
import { ConfigService } from '@nestjs/config';

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
    return await this.artRepository.find();
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
    };
  }

  async createArt(
    fullUrl: string,
    desktopUrl: string,
    mobileUrl: string,
    thumbUrl: string,
    titleEn: string,
    titleFi: string,
    descriptionEn: string,
    descriptionFi: string,
  ): Promise<Art> {
    const art = this.artRepository.create();
    art.fullUrl = fullUrl;
    art.desktopUrl = desktopUrl;
    art.mobileUrl = mobileUrl;
    art.thumbUrl = thumbUrl;
    art.titleEn = titleEn;
    art.titleFi = titleFi;
    art.descriptionEn = descriptionEn;
    art.descriptionFi = descriptionFi;
    await this.artRepository.save(art);
    return art;
  }
}
