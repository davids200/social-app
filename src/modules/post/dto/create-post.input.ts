import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { PostVisibility } from '../post.entity';

registerEnumType(PostVisibility, {
  name: 'PostVisibility',
});

@InputType()
export class CreatePostInput {
  @Field()
  content!: string;

  @Field(() => PostVisibility, { nullable: true })
  visibility?: PostVisibility;
}