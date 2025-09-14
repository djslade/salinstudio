import { Module } from '@nestjs/common';
import { collectionProviders } from './collection.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModule } from 'src/image/image.module';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';

@Module({
  imports: [DatabaseModule, AuthModule, ImageModule],
  providers: [...collectionProviders, CollectionService],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule {}
