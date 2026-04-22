import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
@Entity()
@Unique(['userId', 'postId']) // 🔥 prevents duplicate likes
export class Like {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  userId!: number;

  @Field(() => Int)
  @Column()
  postId!: number;

  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  post!: Post;
}