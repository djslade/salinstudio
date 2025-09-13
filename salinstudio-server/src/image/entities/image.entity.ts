import { Art } from '../../art/entities/art.entity';
import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Collection } from '../../collection/entities/collection.entity';

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

  @OneToOne(() => Art)
  art: Art;

  @OneToOne(() => Collection)
  collection: Collection;
}
