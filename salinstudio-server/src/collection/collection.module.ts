import { Module } from '@nestjs/common';
import { collectionProviders } from './collection.providers';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { ImageModule } from '../image/image.module';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';

@Module({
  imports: [DatabaseModule, AuthModule, ImageModule],
  providers: [...collectionProviders, CollectionService],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule {}
