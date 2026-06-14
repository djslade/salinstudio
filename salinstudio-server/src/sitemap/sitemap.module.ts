import { Module } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { SitemapController } from './sitemap.controller';
import { ArtModule } from '../art/art.module';
import { PurchasableModule } from '../purchasable/purchasable.module';

@Module({
  imports: [ArtModule, PurchasableModule],
  providers: [SitemapService],
  controllers: [SitemapController],
})
export class SitemapModule {}
