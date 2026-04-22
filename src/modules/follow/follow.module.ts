import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { Neo4jService } from '../../infrastructure/database/neo4j/neo4j.service';

@Module({
  providers: [FollowService, FollowResolver, Neo4jService],
})
export class FollowModule {}