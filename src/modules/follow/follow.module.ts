import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { FeedProducer } from '../feed/producers/feed.producer';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [FeedModule],
  providers: [FollowService, FollowResolver, FeedProducer],
})
export class FollowModule {}