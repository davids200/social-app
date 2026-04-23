import { Resolver, Mutation, Query, Args, Context, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post } from './post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
 @Mutation(() => Post)
createPost(
  @Args('userId', { type: () => Int }) userId: number,
  @Args('content') content: string,
) {
  return this.postService.create(userId, content);
}

  @Query(() => [Post]) // ✅ correct, no extra symbols
  getPosts() {
    return this.postService.findAll();
  }
}