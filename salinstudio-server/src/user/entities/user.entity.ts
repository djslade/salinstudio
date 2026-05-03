import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { BaseEntity } from '../../database/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../../flag/entities/flag.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  hashedPassword: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'dev'],
    default: 'admin',
  })
  role: Role;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
