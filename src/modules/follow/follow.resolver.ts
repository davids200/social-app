import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
export class FollowResolver {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  followUser(
    @Args('userId') userId: number,
    @Context() context,
  ) {
    const followerId = context.req.user.userId;
    return this.followService.followUser(followerId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  unfollowUser(
    @Args('userId') userId: number,
    @Context() context,
  ) {
    const followerId = context.req.user.userId;
    return this.followService.unfollowUser(followerId, userId);
  }

  @Query(() => [Number])
  getFollowers(@Args('userId') userId: number) {
    return this.followService.getFollowers(userId);
  }

  @Query(() => [Number])
  getFollowing(@Args('userId') userId: number) {
    return this.followService.getFollowing(userId);
  }
}