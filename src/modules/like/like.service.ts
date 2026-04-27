import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { FeedProducer } from 'src/modules/feed/producers/feed.producer';

@Injectable()
export class LikeService {
  constructor(
    private readonly redis: RedisService,

    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,

    private readonly feedProducer: FeedProducer,
  ) {}

  // =========================
  // ❤️ LIKE POST
  // =========================
  async likePost(userId: string, postId: string) {
    // 1. Redis fast write
    const exists = await this.redis.hasLiked(postId, userId);

    if (exists) {
      return { message: 'Already liked' };
    }

    const count = await this.redis.addLike(postId, userId);

    // 2. Persist in Postgres
    await this.likeRepo.save({ userId, postId });

    // 3. Kafka event (feed update)
    await this.feedProducer.emitLikeEvent({
      userId,
      postId,
      createdAt: new Date(),
    });

    return { likeCount: count };
  }

  // =========================
  // 💔 UNLIKE POST
  // =========================
  async unlikePost(userId: string, postId: string) {
    const count = await this.redis.removeLike(postId, userId);

    await this.likeRepo.delete({ userId, postId });

    await this.feedProducer.emitUnlikeEvent({
      userId,
      postId,
      createdAt: new Date(),
    });

    return { likeCount: count };
  }

  // =========================
  // 📊 GET LIKE COUNT
  // =========================
  async getLikeCount(postId: string) {
    return this.redis.getLikeCount(postId);
  }
}