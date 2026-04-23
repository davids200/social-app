import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType() // 👈 THIS FIXES YOUR ERROR
@Entity()
export class Like {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  userId!: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  postId?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  commentId?: number;
}