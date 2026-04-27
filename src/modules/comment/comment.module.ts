import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver'; 
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post]), 
    RedisModule,FeedModule
  ],
  providers: [
    CommentService,
    CommentResolver,
  ],
  exports: [CommentService],
})
export class CommentModule {}