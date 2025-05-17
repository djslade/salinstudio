import { Art } from 'src/art/entities/art.entity';
import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Genre extends BaseEntity {
  @Column({ unique: true })
  nameEn: string;

  @Column({ unique: true })
  nameFi: string;

  @OneToMany(() => Art, (art) => art.genre)
  art: Art[];
}
