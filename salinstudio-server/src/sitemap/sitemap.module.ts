import { Module } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { SitemapController } from './sitemap.controller';
import { ArtModule } from 'src/art/art.module';

@Module({
  imports: [ArtModule],
  providers: [SitemapService],
  controllers: [SitemapController],
})
export class SitemapModule {}
