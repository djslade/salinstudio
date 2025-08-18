import { BaseEntity } from '../../database/base.entity';
import { Column, Entity } from 'typeorm';

export type ArtCategory =
  | 'drawings'
  | 'paintings'
  | 'pastels'
  | 'digital'
  | 'mixed media';

@Entity()
export class Art extends BaseEntity {
  @Column()
  fullUrl: string;

  @Column()
  desktopUrl: string;

  @Column()
  mobileUrl: string;

  @Column()
  thumbUrl: string;

  @Column()
  titleEn: string;

  @Column()
  titleFi: string;

  @Column()
  descriptionEn: string;

  @Column()
  descriptionFi: string;

  @Column()
  fingerprintChecksum: number;

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
}
