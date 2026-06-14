import {
  BadRequestException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATABASE_CONFIG, REPOSITORY_NAMES } from '../config/constants';
import { Setting } from './entities/setting.entity';

export const SETTING_KEYS = {
  STORE_OPEN: 'store_open',
  ALLOWED_COUNTRIES: 'allowed_countries',
} as const;

const DEFAULTS: Record<string, unknown> = {
  [SETTING_KEYS.STORE_OPEN]: false,
  [SETTING_KEYS.ALLOWED_COUNTRIES]: ['FI'],
};

@Injectable()
export class SettingsService implements OnApplicationBootstrap {
  constructor(
    @Inject(REPOSITORY_NAMES.SETTING)
    private settingRepository: Repository<Setting>,
    @Inject(DATABASE_CONFIG.PROVIDER_NAME)
    private dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    for (const [key, value] of Object.entries(DEFAULTS)) {
      const existing = await this.settingRepository.findOne({ where: { key } });
      if (!existing) {
        await this.settingRepository.save({ key, value: JSON.stringify(value) });
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) return null;
    return JSON.parse(setting.value) as T;
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.settingRepository.save({ key, value: JSON.stringify(value) });
  }

  async setStoreOpen(value: boolean): Promise<void> {
    if (value) {
      const [{ count }] = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM purchasable WHERE "isPublic" = true`,
      );
      if (parseInt(count) === 0) {
        throw new BadRequestException(
          'Cannot open the store: there are no public items',
        );
      }
    }
    await this.set(SETTING_KEYS.STORE_OPEN, value);
  }

  async getAll(): Promise<Record<string, unknown>> {
    const settings = await this.settingRepository.find();
    return Object.fromEntries(
      settings.map((s) => [s.key, JSON.parse(s.value)]),
    );
  }
}
