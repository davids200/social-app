import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';

import { Neo4jModule } from '../../infrastructure/database/neo4j/neo4j.module';
import { QueueModule } from '../../infrastructure/queue/queue.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    Neo4jModule, 
    QueueModule, 
    UserModule
  ],
  providers: [
    FollowService,
    FollowResolver,
  ],
  exports: [
    FollowService,
  ],
})
export class FollowModule {}