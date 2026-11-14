import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SettingsModule } from '../settings/settings.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [AuthModule, SettingsModule],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
