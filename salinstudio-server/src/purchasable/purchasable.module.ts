import { Module } from '@nestjs/common';
import { ArtModule } from 'src/art/art.module';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { ImageModule } from 'src/image/image.module';
import { PurchasableService } from './purchasable.service';
import { PurchasableController } from './purchasable.controller';

@Module({
  imports: [DatabaseModule, AuthModule, ArtModule, ImageModule],
  providers: [PurchasableService],
  controllers: [PurchasableController],
})
export class PurchasableModule {}
