import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostQueueService } from '../../infrastructure/queue/post.queue.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    private postQueue: PostQueueService,
  ) {}

  // 📝 CREATE POST
  async create(userId: number,content: string) {
    // 1. Save to PostgreSQL (SOURCE OF TRUTH)
    const post = await this.postRepo.save(
      this.postRepo.create({
        content,
        userId,
      }),
    );

    // 2. Dispatch async jobs (Redis queue)
    await this.dispatchPostEvents(post);

    return post;
  }

  // 📦 QUEUE HANDLING SEPARATED (CLEAN DESIGN)
  private async dispatchPostEvents(post: Post) {
    await this.postQueue.addPostJob({
      postId: post.id,
      userId: post.userId,
      content: post.content,
      createdAt: post.createdAt,
    });
  }

  // 📥 FETCH POSTS
  findAll() {
    return this.postRepo.find({
      order: { id: 'DESC' },
    });
  }
}