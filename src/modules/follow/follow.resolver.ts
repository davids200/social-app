import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
} from '@nestjs/graphql';

import { BadRequestException, UseGuards } from '@nestjs/common';

import { FollowService } from './follow.service';
import { FollowUserType } from './follow.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
export class FollowResolver {
  constructor(
    private readonly followService: FollowService,
  ) {}

  // =========================
  // 👤 FOLLOW USER (SECURE)
  // =========================
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
async followUser(
  @Args('followingId') followingId: string,
  @Context() ctx: any,
): Promise<boolean> {
  const followerId = ctx.req.user.id; // MUST MATCH JWT STRATEGY
const userId = ctx?.req?.user?.id;
 


  if (!followerId) {
    throw new BadRequestException('Unauthorized user');
  }

  return this.followService.followUser(followerId, followingId);
}





  // =========================
  // ❌ UNFOLLOW USER (SECURE)
  // =========================
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async unfollowUser(
    @Args('followingId') followingId: string,
    @Context() ctx: any,
  ): Promise<boolean> {
    const followerId = ctx.req.user.id;

    if (!followingId) {
      throw new BadRequestException('FollowingId is required');
    }

    if (followerId === followingId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    // 🔥 CHECK USER EXISTS
    const userExists = await this.followService.userExists(followingId);

    if (!userExists) {
      throw new BadRequestException('User does not exist');
    }

    return true;
  }






   // =========================
  // 👥 GET FOLLOWING (CLEAN)
  // =========================
  @Query(() => [FollowUserType])
  async getFollowing(
    @Args('userId') userId: string,
  ): Promise<FollowUserType[]> {

    if (!userId) {
      throw new BadRequestException('UserId is required');
    }

    // 🔥 check if user exists
    const exists = await this.followService.userExists(userId);

    if (!exists) {
      throw new BadRequestException('User does not exist');
    }

    return this.followService.getFollowing(userId);
  }









  // =========================
  // 👥 GET FOLLOWERS (CLEAN)
  // =========================
  @Query(() => [FollowUserType])
  async getFollowers(
    @Args('userId') userId: string,
  ): Promise<FollowUserType[]> {

    if (!userId) {
      throw new BadRequestException('UserId is required');
    }






    // 🔥 check if user exists
    const exists = await this.followService.userExists(userId);

    if (!exists) {
      throw new BadRequestException('User does not exist');
    }

    return this.followService.getFollowers(userId);
  }








}
