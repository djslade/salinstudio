import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import * as geoip from 'geoip-lite';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SETTING_KEYS, SettingsService } from './settings.service';

const GENERIC_WRITABLE_KEYS: string[] = [SETTING_KEYS.ALLOWED_COUNTRIES];

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('public')
  async getPublic(@Req() req: Request) {
    const storeOpen = await this.settingsService.get<boolean>(
      SETTING_KEYS.STORE_OPEN,
    );
    const allowedCountries = await this.settingsService.get<string[]>(
      SETTING_KEYS.ALLOWED_COUNTRIES,
    );
    const ip = req.ip;
    const geo = geoip.lookup(ip);
    const userCountry = geo?.country ?? null;
    return { storeOpen, allowedCountries, userCountry };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAll() {
    return await this.settingsService.getAll();
  }

  @Put('store-open')
  @UseGuards(AuthGuard)
  async setStoreOpen(@Body() body: { value: boolean }) {
    await this.settingsService.setStoreOpen(body.value);
  }

  @Put(':key')
  @UseGuards(AuthGuard)
  async set(@Param('key') key: string, @Body() body: { value: unknown }) {
    // Only plain settings may be written here. Keys with their own validated
    // endpoints (store-open, /content/*) must not be reachable through this.
    if (!GENERIC_WRITABLE_KEYS.includes(key)) {
      throw new BadRequestException(`Setting "${key}" cannot be set here`);
    }
    await this.settingsService.set(key, body.value);
  }
}
