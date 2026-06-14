import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request as ExpRequest } from 'express';
import { isbot } from 'isbot';

@Controller('visitor')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllVisitors() {
    const visitors = await this.visitorService.findAllVisitors();
    return { message: 'OK', visitors };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getVisitor(@Param('id') id: string) {
    const visitor = await this.visitorService.findVisitorById(id);
    return { message: 'OK', visitor };
  }

  @Post()
  @HttpCode(200)
  async createVisitor(@Request() req: ExpRequest) {
    const ua = req.headers['user-agent'] ?? '';
    if (isbot(ua)) {
      return { message: 'OK', visitor: null };
    }
    const forwarded = req.headers['x-forwarded-for'] as string | undefined;
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
    const visitor = await this.visitorService.createVisitor(ip);
    return { message: 'OK', visitor };
  }
}
