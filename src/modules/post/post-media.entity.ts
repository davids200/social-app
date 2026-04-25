import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
@Entity()
export class PostMedia {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  url!: string;

  @Field()
  @Column({ default: 'image' })
  type!: string;

  @ManyToOne(() => Post, (post) => post.media, {
    onDelete: 'CASCADE',
  })
  post?: Post;
}