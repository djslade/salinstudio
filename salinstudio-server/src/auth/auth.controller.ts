import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignupRequestDto } from './dtos/signup-request.dto';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { ExpandedRequest } from './types/expanded-request';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupRequest: SignupRequestDto) {
    this.authService.validateSecret(signupRequest.secret);
    await this.authService.validateUsername(signupRequest.username);

    const user = await this.authService.createUser(
      signupRequest.username,
      signupRequest.password,
    );

    return {
      message: 'Signup successful',
      user: this.authService.getSecureUser(user),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginRequest: LoginRequestDto) {
    const user = await this.authService.validateLoginDetails(
      loginRequest.username,
      loginRequest.password,
    );

    const accessToken = await this.authService.genAccessToken(user);
    const refreshToken = await this.authService.genRefreshToken(user);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: ExpandedRequest) {
    const user = this.authService.getUserFromRequest(req);
    const accessToken = await this.authService.genAccessToken(user);
    const refreshToken = await this.authService.genRefreshToken(user);

    const oldRefreshToken = this.authService.getBearerToken(req.headers);
    await this.authService.revokeRefreshToken(oldRefreshToken);

    return { message: 'Refresh successful', accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: ExpandedRequest) {
    const refreshToken = this.authService.getBearerToken(req.headers);
    await this.authService.revokeRefreshToken(refreshToken);

    return { message: 'Logout successful' };
  }
}
