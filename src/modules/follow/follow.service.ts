import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../infrastructure/database/neo4j/neo4j.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FollowService {
  constructor(
    private neo4j: Neo4jService,
    private eventEmitter: EventEmitter2,
  ) {}

  // 👤 FOLLOW USER
  async followUser(followerId: number, followingId: number) {
    const session = this.neo4j.getSession();

    try {
      await session.run(
        `
        MERGE (a:User {id: $followerId})
        MERGE (b:User {id: $followingId})
        MERGE (a)-[:FOLLOWS]->(b)
        `,
        { followerId, followingId },
      );

      // 🔥 Emit event (correct place)
      this.eventEmitter.emit('user.followed', {
        followerId,
        followingId,
      });

      return { success: true };
    } finally {
      await session.close();
    }
  }

  // ❌ UNFOLLOW USER
  async unfollowUser(followerId: number, followingId: number) {
    const session = this.neo4j.getSession();

    try {
      await session.run(
        `
        MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followingId})
        DELETE r
        `,
        { followerId, followingId },
      );

      // 🔥 Emit event (optional but useful)
      this.eventEmitter.emit('user.unfollowed', {
        followerId,
        followingId,
      });

      return { success: true };
    } finally {
      await session.close();
    }
  }

  // 👥 GET FOLLOWERS
  async getFollowers(userId: number) {
    const session = this.neo4j.getSession();

    try {
      const result = await session.run(
        `
        MATCH (u:User)-[:FOLLOWS]->(me:User {id: $userId})
        RETURN u.id AS id
        `,
        { userId },
      );

      return result.records.map((r) => r.get('id'));
    } finally {
      await session.close();
    }
  }

  // 👤 GET FOLLOWING
  async getFollowing(userId: number) {
    const session = this.neo4j.getSession();

    try {
      const result = await session.run(
        `
        MATCH (me:User {id: $userId})-[:FOLLOWS]->(u:User)
        RETURN u.id AS id
        `,
        { userId },
      );

      return result.records.map((r) => r.get('id'));
    } finally {
      await session.close();
    }
  }
}