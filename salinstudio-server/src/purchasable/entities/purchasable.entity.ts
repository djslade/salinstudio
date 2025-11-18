import { BaseEntity } from 'src/database/base.entity';
import { Image } from 'src/image/entities/image.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Purchasable extends BaseEntity {
  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  quantity: number;

  @Column()
  isOriginal: boolean;

  @Column()
  isFramed: boolean;

  @Column()
  maxPrice: number;

  @Column()
  currentPrice: number;
}
