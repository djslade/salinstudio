import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SettingsService } from '../settings/settings.service';
import { ContentService, CONTENT_KEYS } from './content.service';
import { DEFAULT_ABOUT, DEFAULT_CV } from './content.defaults';
import { UpdateCvDto } from './dtos/update-cv.dto';
import { UpdateAboutDto } from './dtos/update-about.dto';

describe('ContentService', () => {
  let service: ContentService;
  let settingsService: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    settingsService = { get: jest.fn(), set: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: SettingsService, useValue: settingsService },
      ],
    }).compile();
    service = module.get(ContentService);
  });

  describe('onApplicationBootstrap', () => {
    it('seeds defaults only for missing keys', async () => {
      settingsService.get.mockImplementation((key: string) =>
        key === CONTENT_KEYS.ABOUT ? { paragraphs: [] } : null,
      );
      await service.onApplicationBootstrap();
      expect(settingsService.set).toHaveBeenCalledTimes(1);
      expect(settingsService.set).toHaveBeenCalledWith(
        CONTENT_KEYS.CV,
        DEFAULT_CV,
      );
    });
  });

  describe('getters', () => {
    it('return empty content when nothing is stored', async () => {
      settingsService.get.mockResolvedValue(null);
      expect(await service.getAbout()).toEqual({ paragraphs: [] });
      expect(await service.getCv()).toEqual({ categories: [] });
    });
  });

  describe('setCv', () => {
    it('sorts entries newest first and keeps same-year order', async () => {
      const result = await service.setCv({
        categories: [
          {
            titleEn: ' A ',
            titleFi: 'A',
            entries: [
              { year: 2023, textEn: 'old', textFi: 'old' },
              { year: 2024, textEn: 'first', textFi: 'first' },
              { year: 2025, textEn: 'new', textFi: 'new' },
              { year: 2024, textEn: 'second', textFi: 'second' },
            ],
          },
        ],
      });
      expect(result.categories[0].titleEn).toBe('A');
      expect(result.categories[0].entries.map((e) => e.textEn)).toEqual([
        'new',
        'first',
        'second',
        'old',
      ]);
      expect(settingsService.set).toHaveBeenCalledWith(CONTENT_KEYS.CV, result);
    });

    it('drops unknown fields', async () => {
      const result = await service.setCv({
        categories: [
          {
            titleEn: 'A',
            titleFi: 'A',
            extra: 'x',
            entries: [{ year: 2025, textEn: 'a', textFi: 'a', extra: 1 }],
          },
        ],
      } as never);
      expect(result).toEqual({
        categories: [
          {
            titleEn: 'A',
            titleFi: 'A',
            entries: [{ year: 2025, textEn: 'a', textFi: 'a' }],
          },
        ],
      });
    });
  });

  describe('setAbout', () => {
    it('trims text and drops fully empty paragraphs', async () => {
      const result = await service.setAbout({
        paragraphs: [
          { en: ' hi ', fi: 'moi' },
          { en: ' ', fi: '' },
        ],
      });
      expect(result).toEqual({ paragraphs: [{ en: 'hi', fi: 'moi' }] });
    });
  });

  describe('DTO validation', () => {
    it('accepts the default content', async () => {
      expect(
        await validate(plainToInstance(UpdateCvDto, DEFAULT_CV)),
      ).toHaveLength(0);
      expect(
        await validate(plainToInstance(UpdateAboutDto, DEFAULT_ABOUT)),
      ).toHaveLength(0);
    });

    it('rejects a CV entry with a non-integer year or empty text', async () => {
      const dto = plainToInstance(UpdateCvDto, {
        categories: [
          {
            titleEn: 'A',
            titleFi: 'A',
            entries: [{ year: 'soon', textEn: '', textFi: 'x' }],
          },
        ],
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
