import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => Boolean)
  likePost(
    @Args('postId') postId: string,
    @Context() ctx,
  ) {
    return this.likeService.likePost(ctx.req.user.userId, postId);
  }

  @Mutation(() => Boolean)
  unlikePost(
    @Args('postId') postId: string,
    @Context() ctx,
  ) {
    return this.likeService.unlikePost(ctx.req.user.userId, postId);
  }

  @Query(() => Number)
  likeCount(@Args('postId') postId: string) {
    return this.likeService.getLikeCount(postId);
  }
}