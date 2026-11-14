import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor as MultiFileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { createPurchasableDto } from './dto/create-purchasable.dto';
import { ImageService } from '../image/image.service';
import { ArtService } from '../art/art.service';
import { PurchasableService } from './purchasable.service';
import { Image } from '../image/entities/image.entity';
import { updatePurchasableDto } from './dto/update-purchasable.dto';
import type {} from 'multer';
import { SETTING_KEYS, SettingsService } from '../settings/settings.service';
import { PURCHASABLE_MAX_EXTRA_IMAGES } from '../config/constants';

@Controller('purchasable')
export class PurchasableController {
  constructor(
    private purchasableService: PurchasableService,
    private artService: ArtService,
    private imageService: ImageService,
    private settingsService: SettingsService,
  ) {}
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    MultiFileInterceptor('files', PURCHASABLE_MAX_EXTRA_IMAGES, {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async createPurchasable(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: createPurchasableDto,
  ) {
    await this.purchasableService.artIdIsAssigned(body.artId);
    const art = await this.artService.findArtById(body.artId);
    // A new store item automatically includes all of the artwork's images,
    // followed by any store-only images uploaded with it.
    const images: Image[] = [...this.artService.getOrderedImages(art)];
    if (files.length > 0) {
      for (const file of files) {
        images.push(await this.imageService.createImage(file.buffer));
      }
    }
    const purchasable = await this.purchasableService.create(body, art, images);
    return { message: 'Created', purchasable };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllPurchasables() {
    const purchasables = await this.purchasableService.findAll();
    return { message: 'OK', purchasables };
  }

  @Get('public')
  async getAllPublic() {
    const storeOpen = await this.settingsService.get<boolean>(
      SETTING_KEYS.STORE_OPEN,
    );
    if (!storeOpen) return { message: 'OK', purchasables: [] };
    const purchasables = await this.purchasableService.findAllPublic();
    return { message: 'OK', purchasables };
  }

  @Get('nano/:id')
  async getByNanoId(@Param('id') id: string) {
    const purchasable = await this.purchasableService.findByNanoId(id);
    return { message: 'OK', purchasable };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getPurchasable(@Param('id') id: string) {
    const purchasable = await this.purchasableService.findById(id);
    return { message: 'OK', purchasable };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    MultiFileInterceptor('files', PURCHASABLE_MAX_EXTRA_IMAGES, {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async updatePurchasable(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @Body() body: updatePurchasableDto,
  ) {
    const purchasable = await this.purchasableService.findById(id);
    if (body.artId !== purchasable.art.id) {
      await this.purchasableService.artIdIsAssigned(body.artId);
    }
    const art = await this.artService.findArtById(body.artId);
    const artImages = this.artService.getOrderedImages(art);
    const artImageIds = new Set(artImages.map((image) => image.id));

    // Store-only images: images on this store item that don't belong to any
    // artwork. Art images are managed from the artwork and are never deleted
    // here; if the item moves to another artwork, the old art's images are
    // simply unlinked.
    const storeImages = purchasable.images.filter(
      (image) => !this.purchasableService.isArtImage(image, purchasable),
    );
    const keptStoreImages = storeImages.filter((image) =>
      body.imageIds.includes(image.id),
    );
    if (keptStoreImages.length + files.length > PURCHASABLE_MAX_EXTRA_IMAGES) {
      throw new BadRequestException('Too many images');
    }

    const images: Image[] = [...artImages];
    for (const image of keptStoreImages) {
      if (!artImageIds.has(image.id)) images.push(image);
    }
    if (files.length > 0) {
      for (const file of files) {
        images.push(await this.imageService.createImage(file.buffer));
      }
    }

    const imagesToDelete = storeImages.filter(
      (image) => !keptStoreImages.includes(image),
    );
    for (const image of imagesToDelete) {
      await this.imageService.delete(image.id);
    }
    await this.purchasableService.update(id, body, art, images);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePurchasable(@Param('id') id: string) {
    await this.purchasableService.delete(id);
    return { message: 'OK' };
  }
}
