import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtRequestDto } from './dto/create-art.dto';
import { ArtService } from './art.service';

@Controller('art')
export class ArtController {
  constructor(private artService: ArtService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createArt(
    @UploadedFile() image: Express.Multer.File,
    @Body() createArtRequest: CreateArtRequestDto,
  ) {
    const urls = await this.artService.handleImage(image.buffer);
    const art = await this.artService.createArt(
      urls.fullUrl,
      urls.desktopUrl,
      urls.mobileUrl,
      urls.thumbUrl,
      createArtRequest.titleEn,
      createArtRequest.titleFi,
      createArtRequest.descriptionEn,
      createArtRequest.descriptionFi,
    );
    return { message: 'Art created', art };
  }
}
