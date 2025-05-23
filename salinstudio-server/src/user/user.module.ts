import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
