import { Controller, Get, Post, Request } from '@nestjs/common';
import { VisitorService } from './visitor.service';

@Controller('visitor')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Post()
  async createVisitor(@Request() req) {
    const forwarded = req.headers['x-forwarded-for'] as string | undefined;
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
    const visitor = await this.visitorService.createVisitor(ip);
    return { message: 'OK', visitor };
  }
}
