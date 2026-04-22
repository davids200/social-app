import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../infrastructure/database/neo4j/neo4j.service';

@Injectable()
export class FollowService {
  constructor(private neo4jService: Neo4jService) {}


  async followUser(followerId: number, followingId: number) {
    const session = this.neo4jService.getSession();

    console.log("🔥 FOLLOW MUTATION HIT");
console.log("Follower:", followerId);
console.log("Following:", followingId);

    await session.run(
      `
      MERGE (a:User {id: $followerId})
      MERGE (b:User {id: $followingId})
      MERGE (a)-[:FOLLOWS]->(b)
      `,
      { followerId, followingId },
    );

    await session.close();
    return true;
  }



  async unfollowUser(followerId: number, followingId: number) {
    const session = this.neo4jService.getSession();

    await session.run(
      `
      MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followingId})
      DELETE r
      `,
      { followerId, followingId },
    );

    await session.close();
    return true;
  }



  async getFollowers(userId: number) {
    const session = this.neo4jService.getSession();

    const result = await session.run(
      `
      MATCH (u:User)-[:FOLLOWS]->(me:User {id: $userId})
      RETURN u.id AS id
      `,
      { userId },
    );

    await session.close();
    return result.records.map(r => r.get('id'));
  }



  async getFollowing(userId: number) {
    const session = this.neo4jService.getSession();

    const result = await session.run(
      `
      MATCH (me:User {id: $userId})-[:FOLLOWS]->(u:User)
      RETURN u.id AS id
      `,
      { userId },
    );

    await session.close();
    return result.records.map(r => r.get('id'));
  }
}