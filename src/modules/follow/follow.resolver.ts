import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => Boolean)
  async follow(
    @Args('input') input: FollowDto,
    @Context() ctx,
  ) {
    const userId = ctx.req.user.userId;

    await this.followService.follow(userId, input.targetUserId);
    return true;
  }

  @Mutation(() => Boolean)
  async unfollow(
    @Args('input') input: FollowDto,
    @Context() ctx,
  ) {
    const userId = ctx.req.user.userId;

    await this.followService.unfollow(userId, input.targetUserId);
    return true;
  }
}