import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { VisitorModule } from 'src/visitor/visitor.module';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { actionProviders } from './action.providers';

@Module({
  imports: [DatabaseModule, VisitorModule],
  providers: [...actionProviders, ActionService],
  controllers: [ActionController],
})
export class ActionModule {}
