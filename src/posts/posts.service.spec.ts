import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import NotFoundError from '../exceptions/not-found.exception';
import { Post } from '@prisma/client';
import { IUser } from 'src/authentication/guards/authentication.guard';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;
  const user: IUser = {
    sub: 1,
    username: 'testuser',
    exp: 123456,
    iat: 123456,
  };
  const post: CreatePostDto = {
    title: 'Test Post',
    content: 'This is a test post',
    perex: 'Test perex',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const savedPost: Post = {
        id: 1,
        ...post,
        authorId: user.sub,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.post, 'create').mockResolvedValue(savedPost);

      const result = await service.create(post, user);

      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          title: post.title,
          content: post.content,
          perex: post.perex,
          authorId: user.sub,
        },
      });
      expect(result).toEqual(savedPost);
    });
  });

  describe('update', () => {
    it('should update an existing post', async () => {
      const id = 1;

      const existingPost: Post = {
        id,
        ...post,
        authorId: user.sub,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(existingPost);
      jest.spyOn(prismaService.post, 'update').mockResolvedValue(existingPost);

      const result = await service.update(id, post, user);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          title: post.title,
          content: post.content,
          perex: post.perex,
        },
      });
      expect(result).toEqual(existingPost);
    });

    it('should throw a NotFoundError if the post does not exist', async () => {
      const id = 1;

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.update(id, post, user)).rejects.toThrowError(
        new NotFoundError('Post', id.toString()),
      );
    });

    it('should throw a HttpException if the user is not the author of the post', async () => {
      const id = 1;

      const existingPost: Post = {
        id,
        ...post,
        authorId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(existingPost);

      await expect(service.update(id, post, user)).rejects.toThrowError(
        new HttpException(
          'You are not allowed to update this post',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const posts: Post[] = [
        {
          id: 1,
          title: 'Test Post 1',
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          content: 'Test Content 1',
          perex: 'Test Perex 1',
        },
      ];
      jest.spyOn(prismaService.post, 'findMany').mockResolvedValue(posts);

      const result = await service.findAll();

      expect(prismaService.post.findMany).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });

    it('should throw a HttpException if an error occurs', async () => {
      jest.spyOn(prismaService.post, 'findMany').mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrowError(
        new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const id = 1;
      const savedPost: Post = {
        id,
        title: 'Test Post',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: 'Test Content',
        perex: 'Test Perex',
      };
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(savedPost);

      const result = await service.findOne(id);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(savedPost);
    });

    it('should throw a NotFoundError if the post does not exist', async () => {
      const id = 1;
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundError('Post', id.toString()),
      );
    });

    it('should throw a HttpException if an error occurs', async () => {
      const id = 1;
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockRejectedValue(new Error());

      await expect(service.findOne(id)).rejects.toThrowError(
        new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing post', async () => {
      const id = 1;

      const existingPost: Post = {
        id,
        title: 'Test Post',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: 'Test Content',
        perex: 'Test Perex',
      };
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(existingPost);
      jest.spyOn(prismaService.post, 'delete').mockResolvedValue(existingPost);

      const result = await service.delete(id, user);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaService.post.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(existingPost);
    });

    it('should throw a NotFoundError if the post does not exist', async () => {
      const id = 1;

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.delete(id, user)).rejects.toThrowError(
        new NotFoundError('Post', id.toString()),
      );
    });

    it('should throw a HttpException if the user is not the author of the post', async () => {
      const id = 1;

      const existingPost: Post = {
        id,
        title: 'Test Post',
        authorId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: 'Test Content',
        perex: 'Test Perex',
      };
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(existingPost);

      await expect(service.delete(id, user)).rejects.toThrowError(
        new HttpException(
          'You are not allowed to delete this post',
          HttpStatus.FORBIDDEN,
        ),
      );
    });
  });
});
