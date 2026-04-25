import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostVisibility } from './post.entity';
import { PostQueueService } from '../../infrastructure/queue/post.queue.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    private postQueue: PostQueueService,
  ) {}

  // 📝 CREATE POST
  async create(
  userId: string,
  content: string,
  visibility: PostVisibility = PostVisibility.PUBLIC,
) {
  const post = this.postRepo.create({
    content,
    userId,
    visibility, // 👈 correct enum usage
  });

  const saved = await this.postRepo.save(post);

  await this.dispatchPostEvents(saved);

  return saved;
}

  // 📦 QUEUE HANDLING SEPARATED (CLEAN DESIGN)
  private async dispatchPostEvents(post: Post) {
    await this.postQueue.addPostJob({
      postId: String(post.id),
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