import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
            },
          },
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signIn', () => {
    it('should return an access token when valid username and password are provided', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const user = { id: 1, name: username, password };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('access_token');

      const result = await service.signIn(username, password);

      expect(result).toEqual({ access_token: 'access_token' });
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { name: username },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.name,
      });
    });

    it('should throw BadRequestException when user is not found', async () => {
      const username = 'testuser';
      const password = 'testpassword';

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(service.signIn(username, password)).rejects.toThrowError(
        BadRequestException,
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { name: username },
      });
    });

    it('should throw UnauthorizedException when invalid password is provided', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const user = { id: 1, name: username, password: 'wrongpassword' };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);

      await expect(service.signIn(username, password)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { name: username },
      });
    });
  });
});
