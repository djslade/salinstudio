import { Module } from '@nestjs/common';
import { ArtModule } from '../art/art.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ImageModule } from '../image/image.module';
import { PurchasableService } from './purchasable.service';
import { PurchasableController } from './purchasable.controller';
import { purchasableProviders } from './purchasable.providers';

@Module({
  imports: [DatabaseModule, AuthModule, ArtModule, ImageModule],
  providers: [...purchasableProviders, PurchasableService],
  controllers: [PurchasableController],
})
export class PurchasableModule {}
