import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dtos/signIn.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        { provide: AuthenticationService, useValue: { signIn: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('signIn', () => {
    it('should return the result of signIn method from AuthenticationService', async () => {
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'testpassword',
      };
      const expectedResult = {
        access_token: 'access_token',
      };

      jest.spyOn(service, 'signIn').mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(result).toBe(expectedResult);
      expect(service.signIn).toHaveBeenCalledWith(
        signInDto.username,
        signInDto.password,
      );
    });
  });
});
