import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

export type Role = 'admin' | 'dev';

@Entity()
export class Flag extends BaseEntity {
  @Column()
  name: string;

  @Column()
  isEnabled: boolean;

  @Column({
    type: 'enum',
    enum: ['admin', 'dev'],
    default: 'dev',
  })
  minRole: Role;

  @Column()
  sample: number;
}
