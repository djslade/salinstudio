import { Art } from '../../art/entities/art.entity';
import { BaseEntity } from '../../database/base.entity';
import { Image } from '../../image/entities/image.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Purchasable extends BaseEntity {
  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  quantity: number;

  @Column()
  isPublic: boolean;

  @Column()
  isOriginal: boolean;

  @Column()
  isFramed: boolean;

  @Column()
  year: number;

  @Column()
  techniqueEn: string;

  @Column()
  techniqueFi: string;

  @Column()
  maxPrice: number;

  @Column()
  currentPrice: number;

  @Column()
  nanoId: string;

  @OneToOne(() => Art, (art) => art.purchasable, { nullable: true })
  @JoinColumn()
  art: Art;

  @OneToMany(() => Image, (image) => image.purchasable, { cascade: true })
  images: Image[];
}
