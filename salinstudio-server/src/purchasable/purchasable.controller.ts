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
import Multer from 'multer';
import { SETTING_KEYS, SettingsService } from '../settings/settings.service';

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
    MultiFileInterceptor('files', 4, {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async createPurchasable(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: createPurchasableDto,
  ) {
    await this.purchasableService.artIdIsAssigned(body.artId);
    const art = await this.artService.findArtById(body.artId);
    const images: Image[] = [];
    if (files.length > 0) {
      for (let file of files) {
        images.push(await this.imageService.createImage(file.buffer));
      }
    }
    images.push(art.image);
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
    const storeOpen = await this.settingsService.get<boolean>(SETTING_KEYS.STORE_OPEN);
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
    MultiFileInterceptor('files', 5, {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async updatePurchasable(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @Body() body: updatePurchasableDto,
  ) {
    if (body.imageIds.length + files.length > 5) {
      throw new BadRequestException('Too many images');
    }
    const purchasable = await this.purchasableService.findById(id);
    let purchasableImages = purchasable.images;
    if (body.artId !== purchasable.art.id) {
      await this.purchasableService.artIdIsAssigned(body.artId);
      purchasableImages = purchasableImages.filter(
        (image) => image.id !== purchasable.art.image.id,
      );
    }
    const art = await this.artService.findArtById(body.artId);
    const images: Image[] = [];
    if (files.length > 0) {
      for (let file of files) {
        images.push(await this.imageService.createImage(file.buffer));
      }
    }
    if (body.imageIds.length > 0) {
      for (let id of body.imageIds) {
        if (id === art.image.id) continue;
        images.push(await this.imageService.findById(id));
      }
    }
    images.push(art.image);

    const imagesToDelete = purchasableImages.filter(
      (image) => !body.imageIds.includes(image.id),
    );
    if (imagesToDelete.length > 0) {
      for (let image of imagesToDelete) {
        await this.imageService.delete(image.id);
      }
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
