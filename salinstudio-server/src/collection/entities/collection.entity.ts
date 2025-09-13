import { Image } from '../../image/entities/image.entity';
import { Art } from '../../art/entities/art.entity';
import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';

@Entity()
export class Collection extends BaseEntity {
  @Column()
  titleEn: string;

  @Column()
  titleFi: string;

  @Column()
  descriptionEn: string;

  @Column()
  descriptionFi: string;

  @ManyToMany(() => Art, (art) => art.collections)
  art: Art[];

  @OneToOne(() => Image)
  @JoinColumn()
  image: Image;
}
