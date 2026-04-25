import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post, PostVisibility } from './post.entity';
import { PostQueueService } from 'src/infrastructure/queue/post.queue.service';
import { Neo4jService } from 'src/infrastructure/database/neo4j/neo4j.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    private readonly postQueue: PostQueueService,
    private readonly neo4j: Neo4jService,
  ) {}

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

    // 1️⃣ Save in PostgreSQL
    const post = await this.postRepo.save({
      userId,
      content,
      visibility: visibility || PostVisibility.PUBLIC,
    });

    // 2️⃣ Send to queue for Neo4j sync
    await this.postQueue.addPostJob({
      postId: post.id,
      userId,
      content,
      createdAt: new Date().toISOString(),
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

  // =========================
  // 🧠 OPTIONAL: DIRECT NEO4J READ
  // =========================
  async getPostGraph(postId: string) {
    const session = this.neo4j.getSession();

    try {
      const result = await session.run(
        `
        MATCH (p:Post {id: $postId})
        OPTIONAL MATCH (u:User)-[:LIKED_POST]->(p)
        RETURN p, collect(u.id) AS likes
        `,
        { postId },
      );

      return result.records.map((r) => ({
        post: r.get('p').properties,
        likes: r.get('likes'),
      }));
    } finally {
      await session.close();
    }
  }
}