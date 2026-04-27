import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
 
import { CommentModule } from '../comment/comment.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    PostModule,
    CommentModule,
  ],
  providers: [
    UserService,
    UserResolver,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}