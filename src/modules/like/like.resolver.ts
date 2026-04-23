import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { LikeResponse } from './like-response.model';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private likeService: LikeService) {}

  @Mutation(() => LikeResponse)
likePost(
  @Args('userId', { type: () => Int }) userId: number,
  @Args('postId', { type: () => Int }) postId: number,
) {
  return this.likeService.likePost(userId, postId);
}

  @Mutation(() => Like)
  likeComment(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('commentId', { type: () => Int }) commentId: number,
  ) {
    return this.likeService.likeComment(userId, commentId);
  }

  @Mutation(() => LikeResponse)
unlikePost(
  @Args('userId', { type: () => Int }) userId: number,
  @Args('postId', { type: () => Int }) postId: number,
) {
  return this.likeService.unlikePost(userId, postId);
}


 @Mutation(() => LikeResponse)
unlikeComment(
  @Args('userId', { type: () => Int }) userId: number,
  @Args('commentId', { type: () => Int }) commentId: number,
) {
  return this.likeService.unlikeComment(userId, commentId);
}

  @Query(() => Int)
  postLikeCount(
    @Args('postId', { type: () => Int }) postId: number,
  ) {
    return this.likeService.countPostLikes(postId);
  }

  @Query(() => Int)
  commentLikeCount(
    @Args('commentId', { type: () => Int }) commentId: number,
  ) {
    return this.likeService.countCommentLikes(commentId);
  }
}