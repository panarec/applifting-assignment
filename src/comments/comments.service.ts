import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { IUser } from 'src/authentication/guards/authentication.guard';
import NotFoundError from 'src/exceptions/not-found.exception';
import { Comment } from 'src/graphql';
import { parseCommentResponse } from './utils/utils';
import { UpdateCommentDto } from './dtos/update-comment.dts';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(comment: CreateCommentDto, user: IUser): Promise<Comment> {
    const { content, postId } = comment;
    const savedComment = await this.prismaService.comment.create({
      data: {
        content,
        postId,
        userId: user.sub,
      },
      include: { _count: { select: { votes: true } } },
    });
    const commentResponse = parseCommentResponse(savedComment);

    return commentResponse;
  }

  async update(comment: UpdateCommentDto, user: IUser): Promise<Comment> {
    const { content, commentId } = comment;
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
      });
      if (comment === null) {
        throw new NotFoundError('Comment', commentId.toString());
      }
      if (comment.userId !== user.sub) {
        throw new HttpException(
          'You are not allowed to update this comment',
          HttpStatus.FORBIDDEN,
        );
      }
      const updatedComment = await this.prismaService.comment.update({
        where: { id: commentId },
        data: {
          content,
        },
        include: { _count: { select: { votes: true } } },
      });

      const commentResponse = parseCommentResponse(updatedComment);

      return commentResponse;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError || error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Comment[] | HttpException> {
    try {
      const savedComments = await this.prismaService.comment.findMany({
        include: { _count: { select: { votes: true } } },
      });

      const savedCommentsResponse = savedComments.map((comment) =>
        parseCommentResponse(comment),
      );

      return savedCommentsResponse;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Comment | HttpException> {
    try {
      const savedComment = await this.prismaService.comment.findUnique({
        where: { id },
        include: { _count: { select: { votes: true } } },
      });

      if (savedComment === null) {
        throw new NotFoundError('Comment', id.toString());
      }
      const commentResponse = parseCommentResponse(savedComment);

      return commentResponse;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number, user: IUser): Promise<Comment> {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id },
      });
      if (comment === null) {
        throw new NotFoundError('Comment', id.toString());
      }
      if (comment.userId !== user.sub) {
        throw new HttpException(
          'You are not allowed to delete this comment',
          HttpStatus.FORBIDDEN,
        );
      }
      const deletedComment = await this.prismaService.comment.delete({
        where: { id },
        include: { _count: { select: { votes: true } } },
      });

      const deleteCommentResponse = parseCommentResponse(deletedComment);

      return deleteCommentResponse;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError || error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async upVote(commentId: number, ipAddress: string): Promise<number> {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: commentId },
      });
      if (comment === null) {
        throw new NotFoundError('Comment', commentId.toString());
      }
      const vote = await this.prismaService.vote.findFirst({
        where: { commentId, ipAddress },
      });
      if (vote !== null) {
        throw new HttpException(
          'You have already voted for this comment',
          HttpStatus.BAD_REQUEST,
        );
      }

      const savedVote = await this.prismaService.vote.create({
        data: {
          commentId,
          ipAddress,
        },
      });

      return savedVote.id;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError || error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downVote(id: number, ipAddress: string): Promise<void> {
    try {
      await this.prismaService.vote.deleteMany({
        where: { AND: [{ commentId: id }, { ipAddress: ipAddress }] },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError || error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
