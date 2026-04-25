import {
  Resolver,
  Mutation,
  Query,
  Args,
 
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post } from './post.entity';
import { PostVisibility } from './post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  // =========================
  // 📝 CREATE POST
  // =========================
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Args('userId', { type: () => String }) userId: string,
    @Args('content') content: string,
    @Args('visibility', {
      type: () => String,
      nullable: true,
    })
    visibility?: PostVisibility,
  ) {
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