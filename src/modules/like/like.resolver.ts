import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
export class LikeResolver {
  constructor(private likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  likePost(
    @Args('postId') postId: number,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    this.likeService.likePost(userId, postId);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  unlikePost(
    @Args('postId') postId: number,
    @Context() context,
  ) {
    const userId = context.req.user.userId;
    this.likeService.unlikePost(userId, postId);
    return true;
  }

  @Query(() => Number)
  getLikes(@Args('postId') postId: number) {
    return this.likeService.countLikes(postId);
  }
}