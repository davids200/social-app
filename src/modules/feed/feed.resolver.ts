import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FeedService } from './feed.service';
import { Post } from '../post/post.entity';

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post])
  async getFeed(@Context() ctx: any) {
    const userId = ctx.req.user.id;

    return this.feedService.getVisiblePosts(userId);
  }
}