import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtDto } from './dto/create-art.dto';
import { ArtService } from './art.service';
import { OrderAllDto } from './dto/order-all.dto';
import { OrderCategoryDto } from './dto/order-category.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OrderCarouselDto } from './dto/order-carousel.dto';

@Controller('art')
export class ArtController {
  constructor(private artService: ArtService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }),
  )
  async createArt(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateArtDto,
  ) {
    const urls = await this.artService.handleImage(image.buffer);
    const art = await this.artService.createArt({
      ...urls,
      ...body,
    });
    return { message: 'Created', art };
  }

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

  @Get(':id')
  async getArt(@Param('id') id: string) {
    const art = await this.artService.findArtById(id);
    return { message: 'OK', art };
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

  @Patch('order/carousel')
  @UseGuards(AuthGuard)
  async updateCarouselOrder(@Body() body: OrderCarouselDto) {
    await this.artService.updateCarouselOrder(body);
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
