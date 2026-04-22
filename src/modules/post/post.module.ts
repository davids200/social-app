import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';

import { QueueModule } from '../../infrastructure/queue/queue.module'; // 🔥 ADD THIS
import { PostQueueService } from '../../infrastructure/queue/queue.service'; // 🔥 ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    QueueModule, // 🔥 THIS FIXES YOUR ERROR
  ],
  providers: [PostService,PostQueueService, PostResolver],
})
export class PostModule {}