import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_NAMES } from '../config/constants';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';
import { VisitorService } from 'src/visitor/visitor.service';
import { CreateActionDto } from './dtos/create-action.dto';

@Injectable()
export class ActionService {
  constructor(
    @Inject(REPOSITORY_NAMES.EVENT)
    private actionRepository: Repository<Action>,
    private visitorService: VisitorService,
  ) {}

  async createAction(params: CreateActionDto): Promise<Action> {
    const event = this.actionRepository.create();

    const visitor = await this.visitorService.findVisitorById(params.visitorId);
    if (!visitor) throw new NotFoundException('no visitor data was found');

    event.visitor = visitor;
    event.path = params.path;
    event.tag = params.tag;
    event.type = params.type;

    return await this.actionRepository.save(event);
  }
}
