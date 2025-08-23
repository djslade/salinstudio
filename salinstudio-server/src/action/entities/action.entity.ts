import { Visitor } from '../../visitor/entities/visitor.entity';
import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Action extends BaseEntity {
  @ManyToOne(() => Visitor, (visitor) => visitor.actions)
  visitor: Visitor;

  @Column()
  type: string;

  @Column()
  path: string;

  @Column()
  tag: string;
}
