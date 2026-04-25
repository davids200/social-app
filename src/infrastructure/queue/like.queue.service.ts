import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class LikeQueueService {
  constructor(
    @InjectQueue('like-queue')
    private readonly queue: Queue,
  ) {}

  // ❤️ LIKE POST
  async addPostLikeJob(data: { userId: string; postId: string }) {
    await this.queue.add('post.liked', data);
  }

  // 💔 UNLIKE POST
  async addPostUnlikeJob(data: { userId: string; postId: string }) {
    await this.queue.add('post.unliked', data);
  }

  // 💬 LIKE COMMENT
  async addCommentLikeJob(data: { userId: string; commentId: string }) {
    await this.queue.add('comment.liked', data);
  }

  // 💔 UNLIKE COMMENT
  async addCommentUnlikeJob(data: { userId: string; commentId: string }) {
    await this.queue.add('comment.unliked', data);
  }
}