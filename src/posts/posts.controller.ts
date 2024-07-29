import {
  Body,
  Controller,
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
  type IUser,
} from '../authentication/guards/authentication.guard';
import { User } from '../common/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() ceatePostDto: CreatePostDto, @User() user: IUser) {
    const post = await this.postsService.create(ceatePostDto, user);
    return post;
  }

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

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.postsService.findOne(id);
  }
}
