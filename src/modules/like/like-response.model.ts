import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LikeResponse {
  @Field(() => Int, { nullable: true })
  postId?: number;

  @Field(() => Int, { nullable: true })
  commentId?: number;

  @Field(() => Int)
  likeCount!: number;

  @Field()
  likedByMe!: boolean;
}