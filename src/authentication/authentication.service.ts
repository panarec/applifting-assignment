import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    // Of course, this is a simple example. In a real application, I would use a more secure way to store passwords.
    const user = await this.prismaService.user.findFirst({
      where: { name: username },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user?.password !== pass) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
