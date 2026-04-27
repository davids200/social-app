import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { FeedProducer } from 'src/modules/feed/producers/feed.producer';

@Injectable()
export class FollowService {
  private client: Client;

  constructor(
    private readonly feedProducer: FeedProducer,
  ) {
    this.client = new Client({
      contactPoints: ['127.0.0.1:9042'],
      localDataCenter: 'datacenter1',
      keyspace: 'social_app',
    });
  }

  // =========================
  // 👥 FOLLOW USER
  // =========================
  async follow(userId: string, targetUserId: string) {
    const now = new Date();

    // 1️⃣ Store FOLLOW relationship (ScyllaDB)
    await this.client.execute(
      `
      INSERT INTO user_followers (user_id, follower_id, followed_at)
      VALUES (?, ?, ?)
      `,
      [targetUserId, userId, now],
      { prepare: true },
    );

    // reverse lookup
    await this.client.execute(
      `
      INSERT INTO user_following (user_id, following_id, followed_at)
      VALUES (?, ?, ?)
      `,
      [userId, targetUserId, now],
      { prepare: true },
    );

    // 2️⃣ Emit Kafka event (IMPORTANT FOR FEED SYSTEM)
    await this.feedProducer.emitFollowEvent({
      followerId: userId,
      followingId: targetUserId,
      createdAt: now,
    });

    return {
      success: true,
      message: 'Followed successfully',
    };
  }

  // =========================
  // ❌ UNFOLLOW USER
  // =========================
  async unfollow(userId: string, targetUserId: string) {
    // remove follower relation
    await this.client.execute(
      `
      DELETE FROM user_followers 
      WHERE user_id = ? AND follower_id = ?
      `,
      [targetUserId, userId],
      { prepare: true },
    );

    // remove reverse relation
    await this.client.execute(
      `
      DELETE FROM user_following 
      WHERE user_id = ? AND following_id = ?
      `,
      [userId, targetUserId],
      { prepare: true },
    );

    // optional Kafka event
    await this.feedProducer.emitUnfollowEvent({
      followerId: userId,
      followingId: targetUserId,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: 'Unfollowed successfully',
    };
  }
}