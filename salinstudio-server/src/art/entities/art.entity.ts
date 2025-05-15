import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity } from 'typeorm';

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
}
