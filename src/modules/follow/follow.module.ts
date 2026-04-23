import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Neo4jModule } from '../../infrastructure/database/neo4j/neo4j.module'; 

@Module({
  imports: [
    Neo4jModule,   // already needed 
  ],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}