import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SettingsService, SETTING_KEYS } from './settings.service';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';

describe('SettingsService', () => {
  let service: SettingsService;
  let settingRepository: Record<string, jest.Mock>;
  let dataSource: { query: jest.Mock };

  beforeEach(async () => {
    settingRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    };

    dataSource = { query: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: REPOSITORY_NAMES.SETTING,
          useValue: settingRepository,
        },
        {
          provide: DATABASE_CONFIG.PROVIDER_NAME,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  describe('get', () => {
    it('returns null when the setting does not exist', async () => {
      settingRepository.findOne.mockResolvedValue(null);
      const result = await service.get('nonexistent_key');
      expect(result).toBeNull();
    });

    it('returns the parsed JSON value when the setting exists', async () => {
      settingRepository.findOne.mockResolvedValue({
        key: SETTING_KEYS.ALLOWED_COUNTRIES,
        value: JSON.stringify(['FI', 'SE']),
      });
      const result = await service.get<string[]>(
        SETTING_KEYS.ALLOWED_COUNTRIES,
      );
      expect(result).toEqual(['FI', 'SE']);
    });

    it('returns a boolean value correctly', async () => {
      settingRepository.findOne.mockResolvedValue({
        key: SETTING_KEYS.STORE_OPEN,
        value: JSON.stringify(true),
      });
      const result = await service.get<boolean>(SETTING_KEYS.STORE_OPEN);
      expect(result).toBe(true);
    });
  });

  describe('set', () => {
    it('saves the value as a JSON string', async () => {
      await service.set(SETTING_KEYS.STORE_OPEN, false);
      expect(settingRepository.save).toHaveBeenCalledWith({
        key: SETTING_KEYS.STORE_OPEN,
        value: 'false',
      });
    });

    it('saves array values as JSON strings', async () => {
      await service.set(SETTING_KEYS.ALLOWED_COUNTRIES, ['FI', 'DE']);
      expect(settingRepository.save).toHaveBeenCalledWith({
        key: SETTING_KEYS.ALLOWED_COUNTRIES,
        value: '["FI","DE"]',
      });
    });
  });

  describe('setStoreOpen', () => {
    it('throws BadRequestException when opening the store with no public items', async () => {
      dataSource.query.mockResolvedValue([{ count: '0' }]);
      await expect(service.setStoreOpen(true)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('opens the store when there is at least one public item', async () => {
      dataSource.query.mockResolvedValue([{ count: '3' }]);
      settingRepository.save.mockResolvedValue({});
      await expect(service.setStoreOpen(true)).resolves.not.toThrow();
      expect(settingRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'true' }),
      );
    });

    it('closes the store without checking for public items', async () => {
      settingRepository.save.mockResolvedValue({});
      await service.setStoreOpen(false);
      expect(dataSource.query).not.toHaveBeenCalled();
      expect(settingRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'false' }),
      );
    });
  });

  describe('getAll', () => {
    it('returns all settings as a parsed key-value record', async () => {
      settingRepository.find.mockResolvedValue([
        { key: SETTING_KEYS.STORE_OPEN, value: 'false' },
        { key: SETTING_KEYS.ALLOWED_COUNTRIES, value: '["FI"]' },
      ]);
      const result = await service.getAll();
      expect(result).toEqual({
        [SETTING_KEYS.STORE_OPEN]: false,
        [SETTING_KEYS.ALLOWED_COUNTRIES]: ['FI'],
      });
    });

    it('returns an empty record when there are no settings', async () => {
      settingRepository.find.mockResolvedValue([]);
      const result = await service.getAll();
      expect(result).toEqual({});
    });
  });
});
