import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

// ✅ BullMQ queue injection (you MUST have this service)
import { PostQueueService } from '../../infrastructure/queue/queue.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,

    private postQueue: PostQueueService, // 🔥 ADD THIS
  ) {}

  async create(content: string, userId: number) {
    // 1. Save in PostgreSQL (source of truth)
    const post = await this.postRepo.save(
      this.postRepo.create({ content, userId }),
    );

    console.log('🟢 Post saved in PostgreSQL:', post.id);

    // 2. Push to queue (for Neo4j worker)
    await this.postQueue.addPostJob({
      postId: post.id,
      userId,
      content,
    });

    console.log('📨 Job sent to queue');

    return post;
  }

  findAll() {
    return this.postRepo.find({
      order: { id: 'DESC' },
    });
  }
}