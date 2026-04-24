import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

import { QueueModule } from '../../infrastructure/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    QueueModule, // ✅ provides UserQueueService
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