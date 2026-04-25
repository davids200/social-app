import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  // ❤️ POST
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async likePost(
    @Args('postId') postId: string,
    @Context() ctx: any,
  ): Promise<boolean> {
    const userId = ctx.req.user.id;
    return this.likeService.likePost(userId, postId);
  }

  // 💬 COMMENT
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async likeComment(
    @Args('commentId') commentId: string,
    @Context() ctx: any,
  ): Promise<boolean> {
    const userId = ctx.req.user.id;
    return this.likeService.likeComment(userId, commentId);
  }
}