import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Like } from './like.entity';



@ObjectType() // 🔥 IMPORTANT
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  content!: string;

  @Field(() => Int)
  @Column()
  userId!: number;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => Like, (like) => like.post)
likes!: Like[];
}