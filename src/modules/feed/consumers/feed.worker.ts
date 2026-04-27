import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';

@Injectable()
export class FeedWorker {
  private client: Client;

  constructor() {
    this.client = new Client({
      contactPoints: ['127.0.0.1:9042'],
      localDataCenter: 'datacenter1',
      keyspace: 'social_app',
    });
  }

  // =========================
  // 📝 HANDLE NEW POST
  // =========================
  async processNewPost(event: any) {
    const { postId, authorId, createdAt } = event;

    // 1️⃣ Get followers
    const followers = await this.getFollowers(authorId);

    // 2️⃣ Fan-out to each follower
    const queries = followers.map((followerId) => ({
      query: `
        INSERT INTO user_feed (
          user_id, post_id, author_id, created_at, score
        ) VALUES (?, ?, ?, ?, ?)
      `,
      params: [
        followerId,
        postId,
        authorId,
        new Date(createdAt),
        this.calculateScore(createdAt),
      ],
    }));

    await this.client.batch(queries, { prepare: true });
  }

  // =========================
  // 👥 HANDLE FOLLOW EVENT
  // =========================
  async handleFollow(event: any) {
    const { followerId, followingId } = event;

    // OPTIONAL: backfill feed (latest posts)
    // You can later query Postgres or cache service
    console.log(`Follow event: ${followerId} → ${followingId}`);
  }

  // =========================
  // ❌ HANDLE UNFOLLOW EVENT
  // =========================
  async handleUnfollow(event: any) {
    const { followerId, followingId } = event;

    // Remove feed entries (optional optimization)
    await this.client.execute(
      `
      DELETE FROM user_feed
      WHERE user_id = ? AND author_id = ?
      `,
      [followerId, followingId],
      { prepare: true },
    );
  }

  // =========================
  // 📊 GET FOLLOWERS (ScyllaDB)
  // =========================
  async getFollowers(userId: string): Promise<string[]> {
    const result = await this.client.execute(
      `
      SELECT follower_id FROM user_followers
      WHERE user_id = ?
      `,
      [userId],
      { prepare: true },
    );

    return result.rows.map((r) => r.follower_id);
  }

  // =========================
  // 🧠 SIMPLE RANKING
  // =========================
  calculateScore(createdAt: string) {
    const age = (Date.now() - new Date(createdAt).getTime()) / 1000;

    return 1 / (1 + age);
  }
}