import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  postId!: number;

  @Column({ nullable: true })
  parentCommentId?: number;

  @Column()
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}