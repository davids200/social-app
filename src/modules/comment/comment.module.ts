import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { QueueModule } from '../../infrastructure/queue/queue.module';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post]),
    QueueModule, // 🔥 ONLY THIS HANDLES BULL QUEUE
  ],
  providers: [
    CommentService,
    CommentResolver,
  ],
  exports: [CommentService],
})
export class CommentModule {}