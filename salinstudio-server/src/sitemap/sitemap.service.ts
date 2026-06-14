import { Injectable } from '@nestjs/common';
import { ArtService } from '../art/art.service';
import { PurchasableService } from '../purchasable/purchasable.service';
import { create } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

const baseUrl = 'https://miiasalin.com';

@Injectable()
export class SitemapService {
  constructor(
    private artService: ArtService,
    private purchasableService: PurchasableService,
  ) {}

  setUrl(...params: string[]) {
    let url = `${baseUrl}`;
    if (params.length > 0) {
      params.forEach((param) => (url += `/${param}`));
    }
    return url;
  }

  newUrlElement(
    root: XMLBuilder,
    changeFreq: string,
    priority: string,
    lastMod: string,
    ...params: string[]
  ) {
    const urlElement = root.ele('url');
    urlElement.ele('loc').txt(this.setUrl(...params));
    urlElement.ele('xhtml:link', {
      rel: 'alternate',
      hreflang: 'en',
      href: this.setUrl('en', ...params),
    });
    urlElement.ele('xhtml:link', {
      rel: 'alternate',
      hreflang: 'fi',
      href: this.setUrl('fi', ...params),
    });
    urlElement.ele('changefreq').txt(changeFreq);
    urlElement.ele('priority').txt(priority);
    urlElement.ele('lastmod').txt(lastMod);
  }

  async newSitemap() {
    const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
    });

    const [allArt, allPublicPurchasables] = await Promise.all([
      this.artService.findAll(),
      this.purchasableService.findAllPublic(),
    ]);

    const latestArtDate =
      allArt.length > 0
        ? new Date(
            Math.max(...allArt.map((a) => a.updatedAt.getTime())),
          ).toISOString()
        : new Date().toISOString();

    const latestStoreDate =
      allPublicPurchasables.length > 0
        ? new Date(
            Math.max(...allPublicPurchasables.map((p) => p.updatedAt.getTime())),
          ).toISOString()
        : latestArtDate;

    this.newUrlElement(root, 'monthly', '1.0', latestArtDate);
    this.newUrlElement(root, 'yearly', '0.5', '2025-08-26T09:34:08.259Z', 'about');
    this.newUrlElement(root, 'weekly', '0.8', latestArtDate, 'gallery');
    this.newUrlElement(root, 'monthly', '0.8', '2025-08-26T09:34:08.259Z', 'commissions');
    this.newUrlElement(root, 'yearly', '0.5', '2025-08-26T09:34:08.259Z', 'contact');
    this.newUrlElement(root, 'weekly', '0.8', latestStoreDate, 'store');

    for (const art of allArt) {
      this.newUrlElement(
        root,
        'monthly',
        '0.5',
        art.updatedAt.toISOString(),
        'gallery',
        art.slug,
      );
    }

    for (const purchasable of allPublicPurchasables) {
      this.newUrlElement(
        root,
        'monthly',
        '0.6',
        purchasable.updatedAt.toISOString(),
        'store',
        purchasable.nanoId,
      );
    }

    const xmlString = root.end({ prettyPrint: true });
    return xmlString;
  }
}
