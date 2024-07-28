import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [JwtModule, PrismaModule],
})
export class PostsModule {}
