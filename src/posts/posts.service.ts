import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IUser } from '../authentication/guards/authentication.guard';
import NotFoundError from '../exceptions/not-found.exception';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(post: CreatePostDto, user: IUser) {
    const { title, content, perex } = post;
    const savedPost = await this.prismaService.post.create({
      data: {
        title,
        content,
        perex,
        authorId: user.sub,
      },
    });
    return savedPost;
  }

  async update(id: number, post: CreatePostDto, user: IUser) {
    const { title, content, perex } = post;
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id },
      });
      if (post === null) {
        throw new NotFoundError('Post', id.toString());
      }
      if (post.authorId !== user.sub) {
        throw new HttpException(
          'You are not allowed to update this post',
          HttpStatus.FORBIDDEN,
        );
      }
      const updatedPost = await this.prismaService.post.update({
        where: { id },
        data: {
          title,
          content,
          perex,
        },
      });
      return updatedPost;
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

  async findAll(): Promise<Post[] | HttpException> {
    try {
      return await this.prismaService.post.findMany();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Post | HttpException> {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id },
      });
      if (post === null) {
        throw new NotFoundError('Post', id.toString());
      }
      return post;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async delete(id: number, user: IUser) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id },
      });
      if (post === null) {
        throw new NotFoundError('Post', id.toString());
      }
      if (post.authorId !== user.sub) {
        throw new HttpException(
          'You are not allowed to delete this post',
          HttpStatus.FORBIDDEN,
        );
      }
      await this.prismaService.post.delete({
        where: { id },
      });
      return post;
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
