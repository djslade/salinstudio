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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtDto } from './dto/create-art.dto';
import { ArtService } from './art.service';
import { OrderAllDto } from './dto/order-all.dto';
import { OrderCategoryDto } from './dto/order-category.dto';
import { UpdateArtDto } from './dto/update-art.dto';

@Controller('art')
export class ArtController {
  constructor(private artService: ArtService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
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

  @Get(':id')
  async getArt(@Param('id') id: string) {
    const art = await this.artService.findArtById(id);
    return { message: 'OK', art };
  }

  @Patch('order/category')
  async updateCategoryOrder(@Body() body: OrderCategoryDto) {
    await this.artService.updateCategoryOrder(body);
    const art = await this.artService.findAll();
    return { message: 'OK', art };
  }

  @Patch('order/all')
  async updateAllOrder(@Body() body: OrderAllDto) {
    await this.artService.updateAllOrder(body);
    const art = await this.artService.findAll();
    return { message: 'OK', art };
  }

  @Put(':id')
  async updateArt(@Param('id') id: string, @Body() body: UpdateArtDto) {
    await this.artService.update(id, body);
    const art = await this.artService.findArtById(id);
    return { message: 'OK', art };
  }

  @Delete(':id')
  async deleteArt(@Param('id') id: string) {
    await this.artService.delete(id);
    return { message: 'OK' };
  }
}
