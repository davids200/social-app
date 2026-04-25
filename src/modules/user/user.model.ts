import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => String)
  id!: string; // UUID

  @Field()
  username!: string;

  @Field()
  email!: string;
}