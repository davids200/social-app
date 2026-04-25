import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';

import { ObjectType, Field, Int } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

import { PostMedia } from './post-media.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FOLLOWERS = 'FOLLOWERS',
  PRIVATE = 'PRIVATE', 
}

@ObjectType()
@Entity()
export class Post {
 @Field(() => String)
@PrimaryGeneratedColumn('uuid')
id!: string;

  // @Field()
  // @Column({ unique: true })
  // uuid!: string;

  @Field()
  @Column('text')
  content!: string;

@Field(() => String)
@Column()
userId!: string;

  // 👤 OWNER RELATION
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // 👁 VISIBILITY
  @Field(() => String)
  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility!: PostVisibility;

  // 📸 MEDIA
  @Field(() => [PostMedia], { nullable: true })
  @OneToMany(() => PostMedia, (media) => media.post, {
    cascade: true,
    eager: true,
  })
  media?: PostMedia[];

  // 💬 COMMENTS
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  // 🕒 TIMESTAMP
@Field()
@CreateDateColumn()
createdAt!: Date;

@Field()
@CreateDateColumn()
updatedAt!: Date;



  // // ⚡ AUTO UUID
  // @BeforeInsert()
  // generateUuid() {
  //   this.uuid = uuidv4();
  // }
}