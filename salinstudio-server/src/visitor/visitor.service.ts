import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_NAMES } from '../config/constants';
import { Repository } from 'typeorm';
import { Visitor } from './entities/visitor.entity';
import { IPService } from 'src/ip/ip.service';

@Injectable()
export class VisitorService {
  constructor(
    @Inject(REPOSITORY_NAMES.VISITOR)
    private visitorRepository: Repository<Visitor>,
    private ipService: IPService,
  ) {}

  async createVisitor(ip: string): Promise<Visitor> {
    const ipData = await this.ipService.lookupIp(ip);
    if (!ipData)
      throw new BadRequestException('could not get location data for visitor');
    const visitor = this.visitorRepository.create();
    visitor.country = ipData.country;
    visitor.continent = ipData.continent;
    visitor.city = ipData.city;
    visitor.timezone = ipData.timezone;
    visitor.isUsingProxy = ipData.proxy;
    visitor.isMobileUser = ipData.mobile;
    visitor.isTester = ipData.isTester;
    return await this.visitorRepository.save(visitor);
  }

  async findVisitorById(id: string): Promise<Visitor | null> {
    return await this.visitorRepository.findOne({ where: { id } });
  }
}
