import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class ArtController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createArt(@UploadedFile() file: Express.Multer.File) {}
}
