import { Injectable } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import { IPData } from './types/ipData';

@Injectable()
export class IPService {
  lookupIp(ip: string): IPData | null {
    if (ip === '::1' || ip === '127.0.0.1') {
      return {
        continent: '',
        country: '',
        countryCode: '',
        city: '',
        timezone: '',
        mobile: false,
        proxy: false,
        isTester: true,
      };
    }
    const geo = geoip.lookup(ip);
    if (!geo) return null;
    return {
      continent: '',
      country: geo.country,
      countryCode: geo.country,
      city: geo.city,
      timezone: geo.timezone,
      mobile: false,
      proxy: false,
      isTester: false,
    };
  }
}
