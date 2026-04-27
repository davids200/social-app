import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FollowDto {
  @Field()
  targetUserId!: string;
}