import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

import { PostMedia } from './post-media.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';


// =========================
// 🔐 VISIBILITY ENUM
// =========================
export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  COUNTRY = 'COUNTRY',
  DISTRICT = 'DISTRICT',
  SUBCOUNTY = 'SUBCOUNTY',
  PARISH = 'PARISH',
  VILLAGE = 'VILLAGE',
  FOLLOWERS = 'FOLLOWERS',
  PRIVATE = 'PRIVATE',
}

// Register for GraphQL
registerEnumType(PostVisibility, {
  name: 'PostVisibility',
});


// =========================
// 📝 POST ENTITY
// =========================
@ObjectType()
@Entity('post')
export class Post {
  // =========================
  // 🆔 ID
  // =========================
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =========================
  // 📝 CONTENT
  // =========================
  @Field()
  @Column('text')
  content!: string;

  // =========================
  // 👤 USER (FK)
  // =========================
  @Field(() => String)
  @Column()
  userId!: string;

  // Relation
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // =========================
  // 📍 LOCATION
  // =========================
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  locationId?: string;

  // =========================
  // 🔐 VISIBILITY TYPE
  // =========================
  @Field(() => PostVisibility)
  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility!: PostVisibility;

  // =========================
  // 🔢 VISIBILITY LEVEL (optional optimization)
  // =========================
  @Field(() => Int, { nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  visibilityLevel?: number;

  // =========================
  // 📸 MEDIA
  // =========================
  @Field(() => [PostMedia], { nullable: true })
  @OneToMany(() => PostMedia, (media) => media.post, {
    cascade: true,
    eager: true,
  })
  media?: PostMedia[];

  // =========================
  // 💬 COMMENTS
  // =========================
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  // =========================
  // 🕒 TIMESTAMPS
  // =========================
  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}