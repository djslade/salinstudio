import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

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
  async createVisitor(@Request() req) {
    const forwarded = req.headers['x-forwarded-for'] as string | undefined;
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
    const visitor = await this.visitorService.createVisitor(ip);
    return { message: 'OK', visitor };
  }
}
