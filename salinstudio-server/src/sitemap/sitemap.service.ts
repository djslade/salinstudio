import { Injectable } from '@nestjs/common';
import { ArtService } from 'src/art/art.service';
import { create } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

const baseUrl = 'https://miiasalin.com';

const staticRoutes = [
  {
    name: 'Home',
    changeFreq: 'monthly',
    priority: '1.0',
    lastMod: '2025-08-26T09:34:08.259Z',
    params: [],
  },
  {
    name: 'About',
    changeFreq: 'yearly',
    priority: '0.5',
    lastMod: '2025-08-26T09:34:08.259Z',
    params: ['about'],
  },
  {
    name: 'Gallery',
    changeFreq: 'weekly',
    priority: '0.8',
    lastMod: '2025-08-26T09:34:08.259Z',
    params: ['gallery'],
  },
  {
    name: 'Commissions',
    changeFreq: 'monthly',
    priority: '0.8',
    lastMod: '2025-08-26T09:34:08.259Z',
    params: ['commissions'],
  },
  {
    name: 'Contact',
    changeFreq: 'yearly',
    priority: '0.5',
    lastMod: '2025-08-26T09:34:08.259Z',
    params: ['contact'],
  },
];

@Injectable()
export class SitemapService {
  constructor(private artService: ArtService) {}

  setUrl(locale: string, ...params: string[]) {
    let url = `${baseUrl}/${locale}`;
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
    const locales = ['en', 'fi'];
    for (let locale of locales) {
      const urlElement = root.ele('url');
      urlElement.ele('loc').txt(this.setUrl(locale, ...params));
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
  }

  async newSitemap() {
    const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
    });

    for (let route of staticRoutes) {
      this.newUrlElement(
        root,
        route.changeFreq,
        route.priority,
        route.lastMod,
        ...route.params,
      );
    }

    const allArt = await this.artService.findAll();
    for (let art of allArt) {
      this.newUrlElement(
        root,
        'monthly',
        '0.5',
        art.updatedAt.toISOString(),
        'gallery',
        art.slug,
      );
    }

    const xmlString = root.end({ prettyPrint: true });
    return xmlString;
  }
}
