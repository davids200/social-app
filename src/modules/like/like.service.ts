import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './like.entity';
import { LikeQueueService } from 'src/infrastructure/queue/like.queue.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    private readonly likeQueue: LikeQueueService,
  ) {}

  private isValidUUID(id: string): boolean {
    return /^[0-9a-f-]{36}$/i.test(id);
  }

  // =========================
  // ❤️ LIKE / UNLIKE POST
  // =========================
  async likePost(userId: string, postId: string): Promise<boolean> {
    if (!postId) throw new BadRequestException('postId required');
    if (!this.isValidUUID(postId)) {
      throw new BadRequestException('Invalid postId');
    }

    const existing = await this.likeRepo.findOne({
      where: { userId, postId },
    });

    let liked: boolean;

    if (existing) {
  await this.likeRepo.delete(existing.id);
  liked = false;

  // 💔 UNLIKE
  await this.likeQueue.addPostUnlikeJob({
    userId,
    postId,
  });

} else {
  await this.likeRepo.save({ userId, postId });
  liked = true;

  // ❤️ LIKE
  await this.likeQueue.addPostLikeJob({
    userId,
    postId,
  });
}

    return liked;
  }

  // =========================
  // 💬 LIKE / UNLIKE COMMENT
  // =========================
  async likeComment(userId: string, commentId: string): Promise<boolean> {
    if (!commentId) throw new BadRequestException('commentId required');
    if (!this.isValidUUID(commentId)) {
      throw new BadRequestException('Invalid commentId');
    }

    const existing = await this.likeRepo.findOne({
      where: { userId, commentId },
    });

    let liked: boolean;

   
    
    if (existing) {
  await this.likeRepo.delete(existing.id);
  liked = false;

  // 💔 UNLIKE
  await this.likeQueue.addCommentUnlikeJob({
    userId,
    commentId,
  });

} else {
  await this.likeRepo.save({ userId, commentId });
  liked = true;

  // ❤️ LIKE
  await this.likeQueue.addCommentLikeJob({
    userId,
    commentId,
  });
}

    return liked;
  }
}