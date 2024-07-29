import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../database/prisma.service';
import { IUser } from '../authentication/guards/authentication.guard';
import NotFoundError from '../exceptions/not-found.exception';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

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
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const post = {
        title: 'Test Post',
        content: 'Test Content',
        perex: 'Test Perex',
      };
      const user: IUser = { sub: 1, username: 'test-user', iat: 1, exp: 1 };
      const savedPost = {
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
      const post = {
        title: 'Updated Post',
        content: 'Updated Content',
        perex: 'Updated Perex',
      };
      const user: IUser = { sub: 1, username: 'test-user', iat: 1, exp: 1 };
      const updatedPost = {
        id: 1,
        ...post,
        authorId: user.sub,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.post, 'update').mockResolvedValue(updatedPost);

      const result = await service.update(id, post, user);

      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id, authorId: user.sub },
        data: {
          title: post.title,
          content: post.content,
          perex: post.perex,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedPost);
    });

    it('should throw an HttpException if update fails', async () => {
      const id = 1;
      const post = {
        title: 'Updated Post',
        content: 'Updated Content',
        perex: 'Updated Perex',
      };
      const user: IUser = { sub: 1, username: 'test-user', iat: 1, exp: 1 };

      jest
        .spyOn(prismaService.post, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(service.update(id, post, user)).rejects.toThrow(
        HttpException,
      );
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id, authorId: user.sub },
        data: {
          title: post.title,
          content: post.content,
          perex: post.perex,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          perex: 'Perex 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
        },
      ];
      jest.spyOn(prismaService.post, 'findMany').mockResolvedValue(posts);

      const result = await service.findAll();

      expect(prismaService.post.findMany).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });

    it('should throw an HttpException if findMany fails', async () => {
      jest
        .spyOn(prismaService.post, 'findMany')
        .mockRejectedValue(new Error('Find many failed'));

      await expect(service.findAll()).rejects.toThrow(HttpException);
      expect(prismaService.post.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const id = 1;
      const post = {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        perex: 'Perex 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 1,
      };
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(post);

      const result = await service.findOne(id);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(post);
    });

    it('should throw a NotFoundError if post is not found', async () => {
      const id = 1;
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundError);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw an HttpException if findUnique fails', async () => {
      const id = 1;
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockRejectedValue(new Error('Find unique failed'));

      await expect(service.findOne(id)).rejects.toThrow(HttpException);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
