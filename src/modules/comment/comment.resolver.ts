import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  // ➕ Create comment or reply
  @Mutation(() => Comment)
  createComment(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('postId', { type: () => Int }) postId: number,
    @Args('content') content: string,
    @Args('parentCommentId', { type: () => Int, nullable: true })
    parentCommentId?: number,
  ) {
    return this.commentService.createComment({
      userId,
      postId,
      content,
      parentCommentId,
    });
  }

  // 📥 Get all comments for a post
  @Query(() => [Comment])
  comments(
    @Args('postId', { type: () => Int }) postId: number,
  ) {
    return this.commentService.getPostComments(postId);
  }

  // 🔁 Get replies
  @Query(() => [Comment])
  replies(
    @Args('parentCommentId', { type: () => Int }) parentCommentId: number,
  ) {
    return this.commentService.getReplies(parentCommentId);
  }
}