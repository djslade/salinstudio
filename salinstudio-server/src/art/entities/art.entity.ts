import { Image } from '../../image/entities/image.entity';
import { Collection } from '../../collection/entities/collection.entity';
import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';

export type ArtCategory =
  | 'drawings'
  | 'paintings'
  | 'pastels'
  | 'digital'
  | 'mixed media';

@Entity()
export class Art extends BaseEntity {
  @Column()
  titleEn: string;

  @Column()
  titleFi: string;

  @Column()
  descriptionEn: string;

  @Column()
  descriptionFi: string;

  @Column({
    type: 'enum',
    enum: ['drawings', 'paintings', 'pastels', 'digital', 'mixed media'],
    default: 'drawings',
  })
  category: ArtCategory;

  @Column()
  categoryIndex: number;

  @Column()
  totalIndex: number;

  @Column({ default: false })
  onHomeCarousel: boolean;

  @Column({ default: 0 })
  homeCarouselIndex: number;

  @Column({ default: false })
  updatedFingerprint: boolean;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => Collection, (collection) => collection.art)
  collections: Collection[];

  @OneToOne(() => Image)
  @JoinColumn()
  image: Image;
}
