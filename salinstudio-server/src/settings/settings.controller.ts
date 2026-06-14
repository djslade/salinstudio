import {
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

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('public')
  async getPublic(@Req() req: Request) {
    const storeOpen = await this.settingsService.get<boolean>(SETTING_KEYS.STORE_OPEN);
    const allowedCountries = await this.settingsService.get<string[]>(SETTING_KEYS.ALLOWED_COUNTRIES);
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
    await this.settingsService.set(key, body.value);
  }
}
