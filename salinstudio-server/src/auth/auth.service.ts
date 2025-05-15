import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { SecureUser } from './types/secure-user';
import { Repository } from 'typeorm';
import {
  REFRESH_EXPIRES_AT_MS,
  REPOSITORY_NAMES,
  SIGNUP_SECRET,
} from 'src/config/constants';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { IncomingHttpHeaders } from 'http';
import { ExpandedRequest } from './types/expanded-request';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REPOSITORY_NAMES.REFRESH_TOKEN)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  validateSecret(secret: string) {
    if (secret !== SIGNUP_SECRET) {
      throw new UnauthorizedException('The secret is incorrect');
    }
  }

  async validateUsername(username: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      throw new ConflictException('A user with this username already exists');
    }
  }

  // Utility function to strip the user entity of sensitive data
  getSecureUser(user: User): SecureUser {
    return {
      id: user.id,
      username: user.username,
    };
  }

  async createUser(username: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userService.create(username, hashedPassword);
    return user;
  }

  async validateLoginDetails(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('Invalid username or password');
    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordsMatch) {
      throw new NotFoundException('Invalid username or password');
    }
    return user;
  }

  getUserFromRequest(request: ExpandedRequest): User {
    const user = request.user;
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async genAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  async validateAccessToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findById(payload.sub);
      if (!user) throw new Error();
      return user;
    } catch (err) {
      throw new UnauthorizedException('Access token is invalid');
    }
  }

  async genRefreshToken(user: User): Promise<string> {
    const refreshToken = this.refreshTokenRepository.create();
    refreshToken.user = user;
    refreshToken.expiresAt = new Date(Date.now() + REFRESH_EXPIRES_AT_MS);
    await this.refreshTokenRepository.save(refreshToken);
    return refreshToken.id;
  }

  async validateRefreshToken(tokenId: string): Promise<User> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: tokenId },
      relations: { user: true },
    });
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token is invalid');

    return refreshToken.user;
  }

  async revokeRefreshToken(tokenId) {
    await this.refreshTokenRepository.delete({ id: tokenId });
  }

  getBearerToken(headers: IncomingHttpHeaders): string {
    const { authorization } = headers;
    const token = authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Could not find bearer token');
    return token;
  }
}
