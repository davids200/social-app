import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../../infrastructure/database/neo4j/neo4j.service';
import { UserQueueService } from 'src/infrastructure/queue/user.queue.service';

@Injectable()
export class FollowService {
  repo: any;
  constructor(
    private userQueue: UserQueueService,
    private neo4j: Neo4jService,
  ) {}

  // =========================
  // 🚀 FOLLOW USER
  // =========================
  async followUser(followerId: string, followingId: string) {
    await this.userQueue.addFollowJob({
      followerId: String(followerId),
      followingId: String(followingId),
    });

    return { success: true };
  }

  // =========================
  // 💔 UNFOLLOW USER
  // =========================
  async unfollowUser(followerId: string, followingId: string) {
    await this.userQueue.addUnfollowJob({
      followerId: String(followerId),
      followingId: String(followingId),
    });

    return { success: true };
  }

  // =========================
  // 🧠 NEO4J RUNNER
  // =========================
  private async run(query: string, params: any) {
    const session = this.neo4j.getSession();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  // =========================
  // 👥 GET FOLLOWING
  // =========================
 async getFollowing(userId: string) {
  const result = await this.run(
    `
    MATCH (u:User {id: $userId})-[:FOLLOWS]->(f:User)
    RETURN 
      f.id AS id,
      f.username AS username,
      f.email AS email
    `,
    { userId: String(userId) },
  );

  return result.records.map((record) => ({
    id: record.get('id'),
    username: record.get('username'),
    email: record.get('email'),
  }));
}

  // =========================
  // 👥 GET FOLLOWERS
  // =========================
 async getFollowers(userId: string) {
  const result = await this.run(
    `
    MATCH (f:User)-[:FOLLOWS]->(u:User {id: $userId})
    RETURN 
      f.id AS id,
      f.username AS username,
      f.email AS email
    `,
    { userId: String(userId) },
  );

  return result.records.map((record) => ({
    id: record.get('id'),
    username: record.get('username'),
    email: record.get('email'),
  }));
}


 

}