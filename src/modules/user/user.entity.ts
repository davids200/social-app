import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';

import { Post } from '../post/post.entity';

@Entity()
@Index(['email'], { unique: true }) 
@Index(['username'], { unique: true }) 
export class User {

   @Column()
 @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

@Column({ nullable: true })
locationId?: string; 



  // 🔥 RELATION: USER → POSTS
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
}