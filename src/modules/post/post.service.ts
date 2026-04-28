import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'cassandra-driver';

import { Post, PostVisibility } from './post.entity';
import { FeedProducer } from '../feed/producers/feed.producer';

@Injectable()
export class PostService {
  private scylla: Client;

  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    private readonly feedProducer: FeedProducer,
  ) {
    // 🔥 ScyllaDB connection (same as FollowService)
    this.scylla = new Client({
      contactPoints: ['127.0.0.1:9042'],
      localDataCenter: 'datacenter1',
      keyspace: 'social_app',
    });
  }

  // =========================
  // 📝 CREATE POST
  // =========================
  async create(
    userId: string,
    content: string,
    visibility?: PostVisibility,
  ): Promise<Post> {
    if (!content || !content.trim()) {
      throw new BadRequestException('Post content is required');
    }


 

// 🔥 LOCATION ENFORCEMENT (ADD ONLY THIS BLOCK)
const geoBased =
  visibility &&
  ![
    PostVisibility.PUBLIC,
    PostVisibility.PRIVATE,
    PostVisibility.FOLLOWERS,
  ].includes(visibility);

if (geoBased) {
  // You MUST fetch user location (minimal check)
  // If you already store it elsewhere, inject UserRepository later

  throw new BadRequestException(
    'Geo-based posts require user location (not yet enabled in service)',
  );
}







    // 1️⃣ Save in PostgreSQL (SOURCE OF TRUTH)
    const post = await this.postRepo.save({
      userId,
      content,
      visibility: visibility || PostVisibility.PUBLIC,
    });

    const now = new Date();

    // 2️⃣ Save in ScyllaDB (for feed system)
    await this.scylla.execute(
      `
      INSERT INTO posts_by_user (user_id, post_id, content, created_at)
      VALUES (?, ?, ?, ?)
      `,
      [userId, post.id, content, now],
      { prepare: true },
    );

    // 3️⃣ Emit Kafka event (FEED ENGINE TRIGGER)
    await this.feedProducer.emitPostCreated({
      postId: post.id,
      authorId: userId,
      content,
      createdAt: now,
    });

    return post;
  }

  // =========================
  // 📄 GET ALL POSTS
  // =========================
  async findAll(): Promise<Post[]> {
    return this.postRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
}