import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CommentsResolver } from './comments.resolver';

@Module({
  providers: [CommentsService, CommentsResolver],
  imports: [PrismaModule, JwtModule],
})
export class CommentsModule {}
