import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  postId: number;

  @ApiProperty({ example: 'Comment content' })
  @IsString()
  content: string;
}
