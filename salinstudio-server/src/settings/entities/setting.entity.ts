import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryColumn()
  key: string;

  @Column('text')
  value: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
