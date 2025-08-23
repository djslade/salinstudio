import { Body, Controller, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dtos/create-action.dto';

@Controller('action')
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post()
  async createAction(@Body() body: CreateActionDto) {
    await this.actionService.createAction(body);
    return { status: 'Created' };
  }
}
