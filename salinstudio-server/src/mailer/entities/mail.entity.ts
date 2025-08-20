import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

export type MailTopic = 'contact' | 'commission';
@Entity()
export class Mail extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ['contact', 'commission'],
    default: 'contact',
  })
  topic: MailTopic;

  @Column()
  @Column()
  name: string;

  @Column()
  emailAddress: string;

  @Column()
  message: string;
}
