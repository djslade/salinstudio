import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dtos/create-action.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('action')
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllActions() {
    const actions = await this.actionService.getAllActions();
    return { status: 'OK', actions };
  }

  @Post()
  async createAction(@Body() body: CreateActionDto) {
    await this.actionService.createAction(body);
    return { status: 'Created' };
  }
}
