import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number; // receiver

  @Column()
  type!: 'like' | 'follow' | 'comment';

  @Column({ nullable: true })
  sourceUserId!: number;

  @Column({ nullable: true })
  postId!: number;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}