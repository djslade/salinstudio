import { Art } from '../../art/entities/art.entity';
import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Collection } from '../../collection/entities/collection.entity';
import { Purchasable } from '../../purchasable/entities/purchasable.entity';

@Entity()
export class Image extends BaseEntity {
  @Column()
  fullUrl: string;

  @Column()
  desktopUrl: string;

  @Column()
  mobileUrl: string;

  @Column()
  thumbUrl: string;

  @Column()
  fingerprintChecksum: number;

  @Column('float', { default: 0 })
  aspectRatio: number;

  @OneToOne(() => Art)
  art: Art;

  // The artwork this image belongs to (an artwork has up to ART_MAX_IMAGES).
  // Art.image always points at the image with galleryIndex 0.
  @ManyToOne(() => Art, (art) => art.images, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'galleryArtId' })
  galleryArt?: Art;

  @Column({ type: 'uuid', nullable: true })
  galleryArtId: string | null;

  @Column({ default: 0 })
  galleryIndex: number;

  @OneToOne(() => Collection)
  collection: Collection;

  @ManyToOne(() => Purchasable, (purchasable) => purchasable.images, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  purchasable?: Purchasable;
}
