import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { UploadModule } from '../upload/upload.module';
import { DatabaseModule } from '../database/database.module';
import { imageProviders } from './image.providers';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [DatabaseModule, UploadModule, CacheModule.register()],
  providers: [...imageProviders, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
