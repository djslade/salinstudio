import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { CreateMailDto } from './dtos/create-mail.dto';

@Controller('mailer')
export class MailerController {
  constructor(private mailerService: MailerService) {}

  @Post()
  async createMail(@Body() body: CreateMailDto) {
    const mail = await this.mailerService.createMail(body);
    await this.mailerService.sendEmail(mail);
    return { message: 'Created' };
  }
}
