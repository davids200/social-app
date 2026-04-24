import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';

import { QueueModule } from '../../infrastructure/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    QueueModule, // ✅ this is enough
  ],
  providers: [
    PostService,
    PostResolver,
  ],
})
export class PostModule {}