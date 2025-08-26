import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { artProviders } from './art.providers';
import { ArtController } from './art.controller';
import { ArtService } from './art.service';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [DatabaseModule, AuthModule, UploadModule, ImageModule],
  providers: [...artProviders, ArtService],
  controllers: [ArtController],
  exports: [ArtService],
})
export class ArtModule {}
