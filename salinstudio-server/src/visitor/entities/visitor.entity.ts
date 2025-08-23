import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Action } from '../../action/entities/action.entity';

@Entity()
export class Visitor extends BaseEntity {
  @OneToMany(() => Action, (action) => action.visitor)
  actions: Action[];

  @Column()
  continent: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  timezone: string;

  @Column()
  isMobileUser: boolean;

  @Column()
  isUsingProxy: boolean;

  @Column()
  isTester: boolean;
}
