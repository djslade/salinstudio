import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ContentService } from './content.service';
import { UpdateAboutDto } from './dtos/update-about.dto';
import { UpdateCvDto } from './dtos/update-cv.dto';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('about')
  async getAbout() {
    const about = await this.contentService.getAbout();
    return { message: 'OK', about };
  }

  @Get('cv')
  async getCv() {
    const cv = await this.contentService.getCv();
    return { message: 'OK', cv };
  }

  @Put('about')
  @UseGuards(AuthGuard)
  async updateAbout(@Body() body: UpdateAboutDto) {
    const about = await this.contentService.setAbout(body);
    return { message: 'OK', about };
  }

  @Put('cv')
  @UseGuards(AuthGuard)
  async updateCv(@Body() body: UpdateCvDto) {
    const cv = await this.contentService.setCv(body);
    return { message: 'OK', cv };
  }
}
