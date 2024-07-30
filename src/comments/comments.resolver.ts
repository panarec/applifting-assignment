import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { User } from 'src/common/decorators/user.decorator';
import {
  AuthGuard,
  IUser,
} from 'src/authentication/guards/authentication.guard';
import { HttpException, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from 'src/graphql';
import { UpdateCommentDto } from './dtos/update-comment.dts';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private commentService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Mutation('createComment')
  async createComment(
    @Args('createCommentInput') comment: CreateCommentDto,
    @User() user: IUser,
  ): Promise<Comment | HttpException> {
    return this.commentService.create(comment, user);
  }

  @Query('comment')
  async comment(@Args('id') id: number): Promise<Comment | HttpException> {
    return this.commentService.findOne(id);
  }

  @Query('comments')
  async comments(): Promise<Comment[] | HttpException> {
    return this.commentService.findAll();
  }

  @UseGuards(AuthGuard)
  @Mutation('updateComment')
  async updateComment(
    @Args('updateCommentInput') comment: UpdateCommentDto,
    @User() user: IUser,
  ): Promise<Comment | HttpException> {
    return this.commentService.update(comment, user);
  }

  @UseGuards(AuthGuard)
  @Mutation('deleteComment')
  async deleteComment(
    @Args('id') id: number,
    @User() user: IUser,
  ): Promise<Comment | HttpException> {
    return this.commentService.delete(id, user);
  }
}
