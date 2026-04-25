import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Context } from '@nestjs/graphql';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  likePost(
    @Args('postId') postId: string,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user.id;
    return this.likeService.likePost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  likeComment(
    @Args('commentId') commentId: string,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user.id;
    return this.likeService.likeComment(userId, commentId);
  }
}