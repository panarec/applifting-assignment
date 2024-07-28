import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dtos/signIn.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }
}
