import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'cassandra-driver';

@Injectable()
export class ScyllaSchemaService implements OnModuleInit {
  private client: Client;

  constructor() {
    this.client = new Client({
      contactPoints: ['127.0.0.1:9042'],
      localDataCenter: 'datacenter1',
    });
  }

  async onModuleInit() {
    await this.createSchema();
  }

  // =========================
  // 🧱 CREATE KEYSPACE + TABLES
  // =========================
  async createSchema() {
    // 1️⃣ Create Keyspace
    await this.client.execute(`
      CREATE KEYSPACE IF NOT EXISTS social_app
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      };
    `);

    // 2️⃣ Use Keyspace
    await this.client.execute(`USE social_app;`);

    // 3️⃣ Followers Table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS user_followers (
        user_id UUID,
        follower_id UUID,
        followed_at TIMESTAMP,
        PRIMARY KEY (user_id, follower_id)
      );
    `);

    // 4️⃣ Following Table (reverse lookup)
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS user_following (
        user_id UUID,
        following_id UUID,
        followed_at TIMESTAMP,
        PRIMARY KEY (user_id, following_id)
      );
    `);

    // 5️⃣ Post Likes Table
    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS post_likes (
        post_id UUID,
        user_id UUID,
        liked_at TIMESTAMP,
        PRIMARY KEY (post_id, user_id)
      );
    `);

    console.log('✅ ScyllaDB schema initialized successfully');
  }
}