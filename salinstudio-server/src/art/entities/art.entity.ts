import { Image } from '../../image/entities/image.entity';
import { Collection } from '../../collection/entities/collection.entity';
import { BaseEntity } from '../../database/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Purchasable } from '../../purchasable/entities/purchasable.entity';

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
  @JoinTable()
  collections: Collection[];

  // Lead image: always the first entry of `images`. Kept as its own relation
  // so the gallery grid, hero, collections and SEO only need one join.
  @OneToOne(() => Image)
  @JoinColumn()
  image: Image;

  // All images of this artwork, ordered by Image.galleryIndex.
  @OneToMany(() => Image, (image) => image.galleryArt)
  images: Image[];

  @OneToOne(() => Purchasable, (purchasable) => purchasable.art)
  purchasable?: Purchasable;
}
