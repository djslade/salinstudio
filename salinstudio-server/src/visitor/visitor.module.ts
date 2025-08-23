import { Module } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { DatabaseModule } from 'src/database/database.module';
import { visitorProviders } from './visitor.providers';
import { IPModule } from 'src/ip/ip.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule, IPModule],
  providers: [...visitorProviders, VisitorService],
  controllers: [VisitorController],
  exports: [VisitorService],
})
export class VisitorModule {}
