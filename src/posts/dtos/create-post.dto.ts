import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Post title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Post content' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'Post perex' })
  @IsString()
  perex: string;
}
