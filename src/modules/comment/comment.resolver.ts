import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  // =========================
  // 💬 CREATE COMMENT
  // =========================

 @UseGuards(JwtAuthGuard)
@Mutation(() => Comment)
createComment(
  @Context() ctx: any,
  @Args('postId', { type: () => String }) postId: string,
  @Args('content') content: string,
  @Args('parentCommentId', { type: () => String, nullable: true })
  parentCommentId?: string,
) {
  const userId = ctx?.req?.user?.id;

  console.log(ctx.req.user);

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return this.commentService.createComment(
    userId,
    postId,
    content,
    parentCommentId,
  );
}

  // =========================
  // 📄 GET FLAT COMMENTS
  // =========================
  @Query(() => [Comment])
  getPostComments(
    @Args('postId', { type: () => String }) postId: string,
  ) {
    return this.commentService.getPostComments(postId);
  }

  // =========================
  // 🌳 GET COMMENT TREE
  // =========================
  @Query(() => [Comment])
  getCommentTree(
    @Args('postId', { type: () => String }) postId: string,
  ) {
    return this.commentService.getCommentTree(postId);
  }
}