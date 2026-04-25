import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => String)
id!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;
}



