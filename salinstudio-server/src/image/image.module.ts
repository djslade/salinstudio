import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { UploadModule } from 'src/upload/upload.module';
import { DatabaseModule } from 'src/database/database.module';
import { imageProviders } from './image.providers';

@Module({
  imports: [DatabaseModule, UploadModule],
  providers: [...imageProviders, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
