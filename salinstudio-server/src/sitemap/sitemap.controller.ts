import { Controller, Get, Response } from '@nestjs/common';
import { SitemapService } from './sitemap.service';

@Controller('sitemap')
export class SitemapController {
  constructor(private sitemapService: SitemapService) {}

  @Get()
  async newSitemap(@Response() res) {
    const sitemap = await this.sitemapService.newSitemap();
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  }
}
