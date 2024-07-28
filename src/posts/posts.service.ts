import { Injectable } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { PrismaService } from 'src/database/prisma.service';
import { IUser } from 'src/authentication/guards/authentication.guard';

@Injectable()
export class PostsService {
  private readonly posts: Post[] = [];

  constructor(private readonly prismaService: PrismaService) {}

  async create(post: Post, user: IUser) {
    const { title, content, perex } = post;
    await this.prismaService.post.create({
      data: {
        title,
        content,
        perex,
        authorId: user.sub,
      },
    });
  }

  async findAll(): Promise<Post[]> {
    return this.prismaService.post.findMany();
  }

  async findOne(id: number): Promise<Post> {
    return this.prismaService.post.findUnique({
      where: { id },
    });
  }
}
