import {
  Resolver,
  Mutation,
  Query,
  Args,
  Int,
  Context,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowUserType } from './follow.model';
import { UserService } from '../user/user.service';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService,
    private readonly userService: UserService
  ) {}

  // =========================
  // 👤 FOLLOW USER
  // =========================
 @UseGuards(JwtAuthGuard)
@Mutation(() => Boolean)
async followUser(
  @Args('followerId', { type: () => Int }) followerId: number,
  @Args('followingId', { type: () => Int }) followingId: number,
): Promise<boolean> {

  const follower = await this.userService.findUserById(followerId);
  const following = await this.userService.findUserById(followingId);

  console.log("follower111",follower);
  console.log("following222",following);

  // ❌ if either user does not exist → return false
  if (!follower || !following) {
    console.log('❌ Invalid follow attempt: user not found');
    return false;
  }

  const result = await this.followService.followUser(
    followerId,
    followingId,
  );

  return result.success;
}
 




  // =========================
  // ❌ UNFOLLOW USER
  // =========================
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async unfollowUser(
    @Args('followerId', { type: () => Int }) followerId: number,
    @Args('followingId', { type: () => Int }) followingId: number,
  ): Promise<boolean> {
    const result = await this.followService.unfollowUser(
      followerId,
      followingId,
    );

    return result.success;
  }

  // =========================
  // 👥 GET FOLLOWING
  // =========================
  @Query(() => [FollowUserType])
  getFollowing(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.followService.getFollowing(userId);
  }

  // =========================
  // 👥 GET FOLLOWERS
  // =========================
  @Query(() => [FollowUserType])
  getFollowers(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.followService.getFollowers(userId);
  }
}