import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { PostService } from './post.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post } from './post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post) // ✅ return Post, not String
  createPost(
    @Args('content') content: string,
    @Context() context: any, // you can type this later
  ) {
    const userId = context.req.user.userId;
    return this.postService.create(content, userId);
  }

  @Query(() => [Post]) // ✅ correct, no extra symbols
  getPosts() {
    return this.postService.findAll();
  }
}