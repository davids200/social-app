import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('follow')
@Index(['followerId', 'followingId'], { unique: true })
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  followerId!: string;

  @Column()
  followingId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}