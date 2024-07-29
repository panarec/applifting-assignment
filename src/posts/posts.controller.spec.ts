import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
        ConfigService,
        JwtService,
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: Post = {
        content: 'Test Content',
        perex: 'Test Perex',
        title: 'Test Title',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 1,
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createPostDto);

      const result = await controller.create(createPostDto, {} as any);

      expect(service.create).toHaveBeenCalledWith(createPostDto, {} as any);
      expect(result).toBe(createPostDto);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const id = 1;
      const updatePostDto: Post = {
        content: 'Test Content',
        perex: 'Test Perex',
        title: 'Test Title',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 1,
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatePostDto);

      const result = await controller.update(id, updatePostDto, {} as any);

      expect(service.update).toHaveBeenCalledWith(id, updatePostDto, {} as any);
      expect(result).toBe(updatePostDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [
        // Add your test data here
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(posts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBe(posts);
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const id = 1;
      const post = {
        content: 'Test Content',
        perex: 'Test Perex',
        title: 'Test Title',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(post);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(post);
    });
  });
});
