import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  commentId: number;

  @ApiProperty({ example: 'Comment content' })
  @IsString()
  content: string;
}
