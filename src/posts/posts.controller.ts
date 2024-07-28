import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import {
  AuthGuard,
  type IUser,
} from 'src/authentication/guards/authentication.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() ceatePostDto: CreatePostDto, @User() user: IUser) {
    console.log(user);
    this.postsService.create(ceatePostDto, user);
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
