import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import type {} from 'multer';
import { CreateArtDto } from './dto/create-art.dto';
import { ArtService } from './art.service';
import { OrderAllDto } from './dto/order-all.dto';
import { OrderCategoryDto } from './dto/order-category.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SetCarouselDto } from './dto/set-carousel.dto';
import { ImageService } from '../image/image.service';
import { Image } from '../image/entities/image.entity';
import { ART_MAX_IMAGES } from '../config/constants';

const FILE_SIZE_LIMIT = 50 * 1024 * 1024;

@Controller('art')
export class ArtController {
  constructor(
    private artService: ArtService,
    private imageService: ImageService,
  ) {}

  // Accepts the images as `files` (ordered, first = lead). The legacy single
  // `file` field is still accepted and is placed first.
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'files', maxCount: ART_MAX_IMAGES },
      ],
      { limits: { fileSize: FILE_SIZE_LIMIT } },
    ),
  )
  async createArt(
    @UploadedFiles()
    uploads: { file?: Express.Multer.File[]; files?: Express.Multer.File[] },
    @Body() body: CreateArtDto,
  ) {
    const files = [...(uploads?.file ?? []), ...(uploads?.files ?? [])];
    if (files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    if (files.length > ART_MAX_IMAGES) {
      throw new BadRequestException(
        `An artwork can have at most ${ART_MAX_IMAGES} images`,
      );
    }
    const images = await this.createImages(files);
    try {
      const art = await this.artService.createArt({ ...body, images });
      return { message: 'Created', art };
    } catch (err) {
      await this.imageService.deleteMany(images.map((image) => image.id));
      throw err;
    }
  }

  @Post(':id/images')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', ART_MAX_IMAGES, {
      limits: { fileSize: FILE_SIZE_LIMIT },
    }),
  )
  async addArtImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    // Validate before doing the expensive processing and uploads.
    await this.artService.assertCanAddImages(id, files.length);
    const images = await this.createImages(files);
    try {
      const art = await this.artService.addImages(id, images);
      return { message: 'Created', art };
    } catch (err) {
      await this.imageService.deleteMany(images.map((image) => image.id));
      throw err;
    }
  }

  @Patch(':id/images/order')
  @UseGuards(AuthGuard)
  async reorderArtImages(@Param('id') id: string, @Body() body: OrderAllDto) {
    const art = await this.artService.reorderImages(id, body.ids);
    return { message: 'OK', art };
  }

  @Delete(':id/images/:imageId')
  @UseGuards(AuthGuard)
  async deleteArtImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    const art = await this.artService.removeImage(id, imageId);
    return { message: 'OK', art };
  }

  // Processes and uploads files in order. If one fails, the ones already
  // uploaded are removed so no orphaned files are left in storage.
  private async createImages(files: Express.Multer.File[]): Promise<Image[]> {
    const images: Image[] = [];
    try {
      for (const file of files) {
        images.push(await this.imageService.createImage(file.buffer));
      }
      return images;
    } catch (err) {
      await this.imageService.deleteMany(images.map((image) => image.id));
      throw err;
    }
  }

  /* TODO: Move this to an image controller or refactor it here
  @Post('checksum')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }),
  )
  async verifyChecksum(@UploadedFile() image: Express.Multer.File) {
    const checksum = await this.artService.checkFingerprint(image.buffer);
    const art = await this.artService.findArtByChecksum(checksum);
    return { message: 'OK', art };
  }
*/

  @Get()
  async getAllArt() {
    const art = await this.artService.findAll();
    return { message: 'OK', art };
  }

  @Get('carousel')
  async getHomeCarouselArt() {
    const art = await this.artService.findHomeCarouselArt();
    return { message: 'OK', art };
  }

  @Put('carousel')
  @UseGuards(AuthGuard)
  async setCarousel(@Body() body: SetCarouselDto) {
    await this.artService.setCarousel(body);
    return { message: 'OK' };
  }

  @Get(':id')
  async getArt(@Param('id') id: string) {
    const art = await this.artService.findArtById(id);
    return { message: 'OK', art };
  }

  @Get('slug/:id')
  async getArtBySlug(@Param('id') id: string) {
    const art = await this.artService.findArtBySlug(id);
    const { prevSlug, nextSlug } = await this.artService.findPrevAndNext(
      art.totalIndex,
    );
    return { message: 'OK', art, prevSlug, nextSlug };
  }

  @Patch('order/category')
  @UseGuards(AuthGuard)
  async updateCategoryOrder(@Body() body: OrderCategoryDto) {
    await this.artService.updateCategoryOrder(body);
    return { message: 'OK' };
  }

  @Patch('order/all')
  @UseGuards(AuthGuard)
  async updateAllOrder(@Body() body: OrderAllDto) {
    await this.artService.updateAllOrder(body);
    return { message: 'OK' };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateArt(@Param('id') id: string, @Body() body: UpdateArtDto) {
    await this.artService.update(id, body);
    return { message: 'OK' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteArt(@Param('id') id: string) {
    await this.artService.delete(id);
    return { message: 'OK' };
  }
}
