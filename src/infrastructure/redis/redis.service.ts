import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  // =========================
  // ❤️ LIKE SET
  // =========================
  async addLike(postId: string, userId: string) {
    await this.client.sadd(`post:likes:${postId}`, userId);
    return this.client.scard(`post:likes:${postId}`);
  }

  async removeLike(postId: string, userId: string) {
    await this.client.srem(`post:likes:${postId}`, userId);
    return this.client.scard(`post:likes:${postId}`);
  }

  async hasLiked(postId: string, userId: string) {
    return this.client.sismember(`post:likes:${postId}`, userId);
  }

  async getLikeCount(postId: string) {
    return this.client.scard(`post:likes:${postId}`);
  }

  // =========================
  // 💬 COMMENTS COUNT
  // =========================
  async incrementComment(postId: string) {
    return this.client.incr(`post:comments:count:${postId}`);
  }

  async getCommentCount(postId: string) {
    return this.client.get(`post:comments:count:${postId}`);
  }
}