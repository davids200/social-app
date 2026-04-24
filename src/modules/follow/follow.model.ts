import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FollowUserType {
  @Field(() => Int)
  id!: number;

  @Field()
  username!: string;

  @Field()
  email!: string;
}