import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number; // receiver

  @Column()
  type!: 'like' | 'follow' | 'comment' | 'new_post';

  @Column({ nullable: true })
  sourceUserId!: number;

  @Column({ nullable: true })
  postId!: number;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ nullable: true })
commentId?: string;

  @CreateDateColumn()
  createdAt!: Date;
}