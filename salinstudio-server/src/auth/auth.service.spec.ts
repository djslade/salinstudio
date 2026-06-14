import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { REPOSITORY_NAMES } from '../config/constants';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let refreshTokenRepository: Record<string, jest.Mock>;

  const mockUser = {
    id: 'user-1',
    username: 'testuser',
    hashedPassword: 'hashed-password',
    role: 'admin' as const,
    refreshTokens: [],
  };

  beforeEach(async () => {
    refreshTokenRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: REPOSITORY_NAMES.REFRESH_TOKEN,
          useValue: refreshTokenRepository,
        },
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  describe('validateSecret', () => {
    it('throws UnauthorizedException for an incorrect secret', () => {
      expect(() => service.validateSecret('wrong-secret')).toThrow(
        UnauthorizedException,
      );
    });

    it('does not throw for the correct signup secret', () => {
      expect(() => service.validateSecret('signup-secret')).not.toThrow();
    });
  });

  describe('validateUsername', () => {
    it('throws ConflictException when username is already taken', async () => {
      userService.findByUsername.mockResolvedValue(mockUser as any);
      await expect(service.validateUsername('testuser')).rejects.toThrow(
        ConflictException,
      );
    });

    it('resolves without error when username is available', async () => {
      userService.findByUsername.mockResolvedValue(null);
      await expect(service.validateUsername('newuser')).resolves.not.toThrow();
    });
  });

  describe('getSecureUser', () => {
    it('returns id, username, and role without sensitive fields', () => {
      const result = service.getSecureUser(mockUser as any);
      expect(result).toEqual({
        id: 'user-1',
        username: 'testuser',
        role: 'admin',
      });
      expect(result).not.toHaveProperty('hashedPassword');
    });
  });

  describe('createUser', () => {
    it('hashes the password and delegates to userService.create', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      userService.create.mockResolvedValue(mockUser as any);

      const result = await service.createUser('testuser', 'password123');

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.create).toHaveBeenCalledWith('testuser', 'hashed');
      expect(result).toEqual(mockUser);
    });
  });

  describe('validateLoginDetails', () => {
    it('throws NotFoundException when user does not exist', async () => {
      userService.findByUsername.mockResolvedValue(null);
      await expect(
        service.validateLoginDetails('nobody', 'pass'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when password is incorrect', async () => {
      userService.findByUsername.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        service.validateLoginDetails('testuser', 'wrong'),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns the user when credentials are valid', async () => {
      userService.findByUsername.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.validateLoginDetails('testuser', 'correct');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserFromRequest', () => {
    it('throws UnauthorizedException when no user is attached to the request', () => {
      expect(() => service.getUserFromRequest({ user: null } as any)).toThrow(
        UnauthorizedException,
      );
    });

    it('returns the user from the request', () => {
      const result = service.getUserFromRequest({ user: mockUser } as any);
      expect(result).toEqual(mockUser);
    });
  });

  describe('genAccessToken', () => {
    it('signs a JWT with sub and username payload', async () => {
      jwtService.signAsync.mockResolvedValue('access-token');
      const result = await service.genAccessToken(mockUser as any);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        username: 'testuser',
      });
      expect(result).toBe('access-token');
    });
  });

  describe('validateAccessToken', () => {
    it('returns the user for a valid token', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });
      userService.findById.mockResolvedValue(mockUser as any);
      const result = await service.validateAccessToken('valid-token');
      expect(result).toEqual(mockUser);
    });

    it('throws UnauthorizedException when JWT verification fails', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('expired'));
      await expect(service.validateAccessToken('bad-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when user from token payload does not exist', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'ghost' });
      userService.findById.mockResolvedValue(null);
      await expect(service.validateAccessToken('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('genRefreshToken', () => {
    it('creates a refresh token record and returns its id', async () => {
      const fakeToken = { id: 'rt-123', user: null, expiresAt: null };
      refreshTokenRepository.create.mockReturnValue(fakeToken);
      refreshTokenRepository.save.mockResolvedValue(fakeToken);

      const result = await service.genRefreshToken(mockUser as any);

      expect(result).toBe('rt-123');
      expect(refreshTokenRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ user: mockUser }),
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('returns the user for a valid refresh token', async () => {
      refreshTokenRepository.findOne.mockResolvedValue({
        id: 'rt-1',
        user: mockUser,
      });
      const result = await service.validateRefreshToken('rt-1');
      expect(result).toEqual(mockUser);
    });

    it('throws UnauthorizedException when refresh token is not found', async () => {
      refreshTokenRepository.findOne.mockResolvedValue(null);
      await expect(service.validateRefreshToken('bad-rt')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('revokeRefreshToken', () => {
    it('deletes the refresh token from the repository', async () => {
      await service.revokeRefreshToken('rt-1');
      expect(refreshTokenRepository.delete).toHaveBeenCalledWith({
        id: 'rt-1',
      });
    });
  });

  describe('validateRoleSecret', () => {
    it('throws UnauthorizedException for an incorrect role secret', () => {
      expect(() => service.validateRoleSecret('wrong')).toThrow(
        UnauthorizedException,
      );
    });

    it('does not throw for the correct role secret', () => {
      expect(() => service.validateRoleSecret('role-secret')).not.toThrow();
    });
  });

  describe('getBearerToken', () => {
    it('extracts the token from a valid Authorization header', () => {
      const result = service.getBearerToken({
        authorization: 'Bearer my-token',
      });
      expect(result).toBe('my-token');
    });

    it('throws UnauthorizedException when Authorization header is absent', () => {
      expect(() => service.getBearerToken({} as any)).toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when Authorization header has no token', () => {
      expect(() =>
        service.getBearerToken({ authorization: 'Bearer ' } as any),
      ).toThrow(UnauthorizedException);
    });
  });
});
