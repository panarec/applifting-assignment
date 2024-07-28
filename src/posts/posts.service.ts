import { Injectable } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PostsService {
  private readonly posts: Post[] = [];

  constructor(private readonly prismaService: PrismaService) {}

  async create(post: Post) {
    await this.prismaService.post.create({
      data: {
        title: post.title,
        content: post.content,
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
