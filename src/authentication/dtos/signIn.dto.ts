import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @ApiProperty({ default: 'alice' })
  username: string;

  @IsString()
  @ApiProperty({ default: 'password' })
  password: string;
}
