import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field()
  name!: string;

  @Field(() => Int)
  level!: number;

  @Field({ nullable: true })
  parentId?: string;
}