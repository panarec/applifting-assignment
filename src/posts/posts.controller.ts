import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import {
  AuthGuard,
  IUser,
} from '../authentication/guards/authentication.guard';
import { User } from '../common/decorators/user.decorator';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Post created' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    const post = await this.postsService.create(createPostDto, user);
    return post;
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiResponse({ status: 200, description: 'Post updated' })
  @ApiResponse({
    status: 403,
    description: 'User is not allowed to updated post',
  })
  @ApiResponse({ status: 404, description: 'Post was not found' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatePostDto: CreatePostDto,
    @User() user: IUser,
  ) {
    const post = await this.postsService.update(id, updatePostDto, user);
    return post;
  }

  @ApiResponse({ status: 200, description: 'All posts' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.postsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number, @User() user: IUser) {
    return this.postsService.delete(id, user);
  }
}
