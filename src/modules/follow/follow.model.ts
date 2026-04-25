import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FollowUserType {
  @Field(() => String)
  id!: string; // UUID comes from DB entity

  @Field()
  username!: string;

  @Field()
  email!: string;
}