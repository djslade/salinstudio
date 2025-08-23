import { BaseEntity } from '../../database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class LookupThrottle extends BaseEntity {
  @Column('date')
  expiresAt: Date;
}
