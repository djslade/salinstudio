import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { artProviders } from './art.providers';
import { ArtController } from './art.controller';
import { ArtService } from './art.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [...artProviders, ArtService],
  controllers: [ArtController],
})
export class ArtModule {}
