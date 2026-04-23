import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class NotificationModel {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field()
  type!: string;

  @Field(() => Int)
  sourceUserId!: number;

  @Field(() => Int, { nullable: true })
  postId?: number;

  @Field()
  isRead!: boolean;

  @Field()
  createdAt!: Date;
}