import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_NAMES } from 'src/config/constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_NAMES.USER)
    private userRepository: Repository<User>,
  ) {}

  async create(username: string, hashedPassword: string): Promise<User> {
    const user = this.userRepository.create();
    user.username = username;
    user.hashedPassword = hashedPassword;
    await this.userRepository.save(user);
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error();
    return user;
  }
}
