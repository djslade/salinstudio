import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { DatabaseModule } from '../database/database.module';
import { mailProviders } from './mailer.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...mailProviders, MailerService],
  controllers: [MailerController],
})
export class MailerModule {}
