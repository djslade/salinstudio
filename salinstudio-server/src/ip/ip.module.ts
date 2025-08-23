import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ipProviders } from './ip.providers';
import { IPService } from './ip.service';

@Module({
  imports: [DatabaseModule],
  providers: [...ipProviders, IPService],
  exports: [IPService],
})
export class IPModule {}
