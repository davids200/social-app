import {
  Resolver,
  Mutation,
  Query,
  Args,
  Context,
  
} from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';

import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post, PostVisibility } from './post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  // =========================
  // 📝 CREATE POST (SECURE)
  // =========================
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args('content') content: string,
    @Args('visibility', {
      type: () => String,
      nullable: true,
    })
    visibility: PostVisibility,
    @Context() ctx: any,
  ): Promise<Post> {
    const userId = ctx.req.user?.id;

    if (!userId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.postService.create(userId, content, visibility);
  }

  // =========================
  // 📄 GET ALL POSTS
  // =========================
  @Query(() => [Post])
  getPosts() {
    return this.postService.findAll();
  }
}