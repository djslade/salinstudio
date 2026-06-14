import { Module } from '@nestjs/common';
import { ArtModule } from '../art/art.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ImageModule } from '../image/image.module';
import { PurchasableService } from './purchasable.service';
import { PurchasableController } from './purchasable.controller';
import { purchasableProviders } from './purchasable.providers';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [DatabaseModule, AuthModule, ArtModule, ImageModule, SettingsModule],
  providers: [...purchasableProviders, PurchasableService],
  controllers: [PurchasableController],
  exports: [PurchasableService],
})
export class PurchasableModule {}
