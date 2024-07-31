import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CommentsResolver } from './comments.resolver';
import { CommentsController } from './comments.controller';
import { SocketModule } from '../socket/socket.module';

@Module({
  providers: [CommentsService, CommentsResolver],
  controllers: [CommentsController],
  imports: [PrismaModule, JwtModule, SocketModule],
})
export class CommentsModule {}
