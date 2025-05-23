import { BaseEntity } from '../../database/base.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Column('date')
  expiresAt: Date;
}
