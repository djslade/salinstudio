import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VisitorModule } from '../visitor/visitor.module';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { actionProviders } from './action.providers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, VisitorModule, AuthModule],
  providers: [...actionProviders, ActionService],
  controllers: [ActionController],
})
export class ActionModule {}
