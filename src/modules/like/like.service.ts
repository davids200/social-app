import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { LikeQueueService } from './../../infrastructure/queue/like.queue.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    private readonly likeQueue: LikeQueueService,
  ) {}

  // =========================
  // ❤️ LIKE / UNLIKE POST
  // =========================
  async likePost(userId: string, postId: string) {
    if (!postId) throw new BadRequestException('PostId required');

    const existing = await this.likeRepo.findOne({
      where: { userId, postId },
    });

    let liked: boolean;

    if (existing) {
      await this.likeRepo.delete(existing.id);
      liked = false;
    } else {
      await this.likeRepo.save({
        userId,
        postId,
      });
      liked = true;
    }

    // =========================
    // 🚀 QUEUE FOR NEO4J SYNC
    // =========================
    await this.likeQueue.addLikeJob({
      userId,
      postId,
    });

    // =========================
    // 🔔 NOTIFICATION EVENT
    // =========================
    await this.likeQueue.addPostLikedNotification({
      userId,
      postId,
    });

    return { liked };
  }

  // =========================
  // 💬 LIKE / UNLIKE COMMENT
  // =========================
  async likeComment(userId: string, commentId: string) {
    if (!commentId) throw new BadRequestException('CommentId required');

    const existing = await this.likeRepo.findOne({
      where: { userId, commentId },
    });

    let liked: boolean;

    if (existing) {
      await this.likeRepo.delete(existing.id);
      liked = false;
    } else {
      await this.likeRepo.save({
        userId,
        commentId,
      });
      liked = true;
    }

    // =========================
    // 🚀 QUEUE FOR NEO4J SYNC
    // =========================
    await this.likeQueue.addLikeJob({
      userId,
      commentId,
    });


    
    // =========================
    // 🔔 NOTIFICATION EVENT
    // =========================
    await this.likeQueue.addCommentLikedNotification({
      userId,
      commentId,
    });

    return { liked };
  }
}