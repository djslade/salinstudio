import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_NAMES } from 'src/config/constants';
import { LookupThrottle } from './entities/lookup-throttle.entity';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { IPData } from './types/ipData';

@Injectable()
export class IPService {
  constructor(
    @Inject(REPOSITORY_NAMES.LOOKUP_THROTTLE)
    private lookupThrottleRepository: Repository<LookupThrottle>,
  ) {}

  async checkForThrottle() {
    return await this.lookupThrottleRepository.findOne({
      where: { expiresAt: MoreThan(new Date()) },
    });
  }

  async createThrottle(expiresInSeconds: number) {
    const expiresAt = new Date(new Date().getTime() + expiresInSeconds * 1000);
    const throttle = this.lookupThrottleRepository.create();
    throttle.expiresAt = expiresAt;
    return await this.lookupThrottleRepository.save(throttle);
  }

  async deleteExpiredThrottles() {
    await this.lookupThrottleRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }

  async lookupIp(ip: string): Promise<IPData | null> {
    if ((await this.checkForThrottle()) !== null) return null;
    if (ip === '::1') {
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
    const endpoint = `http://ip-api.com/json/${ip}?fields=1294611`;
    const res = await fetch(endpoint);
    const remainingRequests: number = parseInt(res.headers['X-Rl']);
    if (remainingRequests === 0) {
      const expiresInSeconds: number = parseInt(res.headers['X-Ttl']);
      await this.createThrottle(expiresInSeconds);
    }
    const { continent, country, countryCode, city, timezone, mobile, proxy } =
      await res.json();
    return {
      continent,
      country,
      countryCode,
      city,
      timezone,
      mobile,
      proxy,
      isTester: false,
    };
  }
}
