import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ArtModule } from './art/art.module';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ArtModule,
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
    MailerModule,
  ],
})
export class AppModule {}
