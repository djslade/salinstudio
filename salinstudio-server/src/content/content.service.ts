import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { DEFAULT_ABOUT, DEFAULT_CV } from './content.defaults';
import { AboutContent, CvContent } from './content.types';

export const CONTENT_KEYS = {
  ABOUT: 'about_content',
  CV: 'cv_content',
} as const;

const DEFAULTS: Record<string, unknown> = {
  [CONTENT_KEYS.ABOUT]: DEFAULT_ABOUT,
  [CONTENT_KEYS.CV]: DEFAULT_CV,
};

export const isContentKey = (key: string) =>
  (Object.values(CONTENT_KEYS) as string[]).includes(key);

@Injectable()
export class ContentService implements OnApplicationBootstrap {
  constructor(private settingsService: SettingsService) {}

  async onApplicationBootstrap() {
    for (const [key, value] of Object.entries(DEFAULTS)) {
      const existing = await this.settingsService.get(key);
      if (existing === null) {
        await this.settingsService.set(key, value);
      }
    }
  }

  async getAbout(): Promise<AboutContent> {
    return (
      (await this.settingsService.get<AboutContent>(CONTENT_KEYS.ABOUT)) ?? {
        paragraphs: [],
      }
    );
  }

  async getCv(): Promise<CvContent> {
    return (
      (await this.settingsService.get<CvContent>(CONTENT_KEYS.CV)) ?? {
        categories: [],
      }
    );
  }

  async setAbout(content: AboutContent): Promise<AboutContent> {
    const clean = ContentService.normalizeAbout(content);
    await this.settingsService.set(CONTENT_KEYS.ABOUT, clean);
    return clean;
  }

  async setCv(content: CvContent): Promise<CvContent> {
    const clean = ContentService.normalizeCv(content);
    await this.settingsService.set(CONTENT_KEYS.CV, clean);
    return clean;
  }

  // Copies only known fields (the global ValidationPipe does not whitelist)
  // and drops paragraphs that are empty in both languages.
  static normalizeAbout(content: AboutContent): AboutContent {
    return {
      paragraphs: content.paragraphs
        .map((p) => ({ en: p.en.trim(), fi: p.fi.trim() }))
        .filter((p) => p.en || p.fi),
    };
  }

  // Categories keep their manual order; entries are sorted newest year first.
  // Array.prototype.sort is stable, so same-year entries keep their order.
  static normalizeCv(content: CvContent): CvContent {
    return {
      categories: content.categories.map((c) => ({
        titleEn: c.titleEn.trim(),
        titleFi: c.titleFi.trim(),
        entries: c.entries
          .map((e) => ({
            year: e.year,
            textEn: e.textEn.trim(),
            textFi: e.textFi.trim(),
          }))
          .sort((a, b) => b.year - a.year),
      })),
    };
  }
}
