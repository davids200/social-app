import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => Int)
  id!: number;

  @Field()
  username!: string;

  @Field()
  email!: string;
}