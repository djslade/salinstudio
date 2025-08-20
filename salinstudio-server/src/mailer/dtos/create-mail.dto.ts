import { IsEmail, IsNotEmpty } from 'class-validator';
import { MailTopic } from '../entities/mail.entity';

export class CreateMailDto {
  @IsNotEmpty()
  topic: MailTopic;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  message: string;
}
