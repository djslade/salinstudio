import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { REPOSITORY_NAMES } from 'src/config/constants';
import { Repository } from 'typeorm';
import { Mail } from './entities/mail.entity';
import { CreateMailDto } from './dtos/create-mail.dto';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(
    @Inject(REPOSITORY_NAMES.MAIL)
    private mailRepository: Repository<Mail>,
    private configService: ConfigService,
  ) {}

  async createMail(params: CreateMailDto): Promise<Mail> {
    const mail = this.mailRepository.create();
    mail.topic = params.topic;
    mail.name = params.name;
    mail.emailAddress = params.emailAddress;
    mail.message = params.message;
    return await this.mailRepository.save(mail);
  }

  async sendEmail(mail: Mail) {
    const mailKey = this.configService.getOrThrow('MAIL_KEY');
    const sendToAddress = this.configService.getOrThrow('MAIL_SEND_TO_ADDRESS');
    const resend = new Resend(mailKey);
    const subject =
      mail.topic === 'contact'
        ? `New message from ${mail.name}`
        : `Commission request from ${mail.name}`;

    const { error } = await resend.emails.send({
      from: 'Leonard <noreply@contact.miiasalin.com>',
      to: [sendToAddress],
      subject,
      html: `
      <p>Hi Miia</p>
      <p>You have a new message from ${mail.name}.</p>
      <strong>${mail.message}</strong>
      <p>You can reply to this message at ${mail.emailAddress}</p>
      `,
    });

    if (error) {
      console.log(error);
      throw new InternalServerErrorException('could not send email');
    }
  }
}
