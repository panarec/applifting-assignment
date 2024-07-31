import { Controller, Ip, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { SocketService } from 'src/socket/socket.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly socketService: SocketService,
  ) {}

  @Post(':id/vote/up')
  async upVote(
    @Param('id', new ParseIntPipe()) id: number,
    @Ip() ipAddress: string,
  ) {
    const voteId = await this.commentsService.upVote(id, ipAddress);
    this.socketService.emitEvent('comment_upvote', { id, voteId });
  }

  @Post(':id/vote/down')
  async downVote(
    @Param('id', new ParseIntPipe()) id: number,
    @Ip() ipAddress: string,
  ) {
    await this.commentsService.downVote(id, ipAddress);
    this.socketService.emitEvent('comment_downvote', { id });
  }
}
