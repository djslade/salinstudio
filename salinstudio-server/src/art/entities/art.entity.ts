import { BaseEntity } from 'src/database/base.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Art extends BaseEntity {
  @ManyToOne(() => Genre, (genre) => genre.art)
  genre: Genre;

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
}
