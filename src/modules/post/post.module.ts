import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostMedia } from './post-media.entity';
import { QueueModule } from '../../infrastructure/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Post, PostMedia]),
    QueueModule, // ✅ this is enough
  ],
  exports: [PostService],
  providers: [
    PostService,
    PostResolver,
  ],
})
export class PostModule {}