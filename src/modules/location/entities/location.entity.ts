import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@ObjectType()
@Entity('locations')
export class Location {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  level!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  parentId?: string;
}