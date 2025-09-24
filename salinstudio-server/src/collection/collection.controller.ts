import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ImageService } from 'src/image/image.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCollectionDto } from './dtos/create-collection.dto';
import { UpdateCollectionDto } from './dtos/update-collection.dto';

@Controller('collection')
export class CollectionController {
  constructor(
    private collectioNService: CollectionService,
    private imageService: ImageService,
  ) {}

  @Get()
  async getAllCollections() {
    const collections = await this.collectioNService.getAllCollections();
    return { message: 'OK', collections };
  }

  @Get(':id')
  async getCollection(@Param('id') id: string) {
    const collection = await this.collectioNService.getCollectionById(id);
    return { message: 'OK', collection };
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }),
  )
  async postCollection(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateCollectionDto,
  ) {
    const image = await this.imageService.createImage(file.buffer);
    const collection = await this.collectioNService.createCollection(
      body,
      image,
    );
    return { message: 'Created', collection };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCollection(
    @Param('id') id: string,
    @Body() body: UpdateCollectionDto,
  ) {
    await this.collectioNService.updateCollection(id, body);
    return { message: 'OK' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCollection(@Param('id') id: string) {
    await this.collectioNService.deleteCollection(id);
    return { message: 'OK' };
  }
}
