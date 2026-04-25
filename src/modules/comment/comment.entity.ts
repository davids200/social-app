import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field } from '@nestjs/graphql';
import { Post } from '../post/post.entity';

@ObjectType()
@Entity()
export class Comment {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  content!: string;

  @Field()
  @Column()
  userId!: string;

  @Field()
  @Column()
  postId!: string;

  @Field(() => String, { nullable: true })
@Column({ type: 'uuid', nullable: true })
parentCommentId!: string | null;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}