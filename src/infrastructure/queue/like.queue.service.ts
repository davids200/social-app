import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class LikeQueueService {
  constructor(
    @InjectQueue('like-queue') private readonly queue: Queue,
  ) {}




  
  // =========================
  // ❤️ CORE LIKE EVENT (NEO4J SYNC)
  // =========================
  async addLikeJob(data: {
    userId: string;
    postId?: string;
    commentId?: string;
  }) {
    await this.queue.add('like.created', data);
  }





  // =========================
  // 🔔 POST LIKE NOTIFICATION
  // =========================
  async addPostLikedNotification(data: {
    userId: string;
    postId: string;
  }) {
    await this.queue.add('post.liked', data);
  }





  // =========================
  // 🔔 COMMENT LIKE NOTIFICATION
  // =========================
  async addCommentLikedNotification(data: {
    userId: string;
    commentId: string;
  }) {
    await this.queue.add('comment.liked', data);
  }
}