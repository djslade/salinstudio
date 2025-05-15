import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { authProviders } from './auth.providers';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/constants';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [...authProviders, AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
