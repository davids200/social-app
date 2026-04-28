import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostMedia } from './post-media.entity'; 
import { FeedModule } from '../feed/feed.module';
import { LocationModule } from '../location/location.module'; // 🔥 LOCATION MODULE

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Post, PostMedia]), 
      FeedModule,
      LocationModule
  ],
  exports: [PostService],
  providers: [
    PostService,
    PostResolver,
  ],
})
export class PostModule {}