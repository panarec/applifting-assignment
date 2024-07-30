import { IsNumber, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsNumber()
  commentId: number;

  @IsString()
  content: string;
}
