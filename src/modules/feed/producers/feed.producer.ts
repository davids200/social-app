import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class FeedProducer {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  emitPostCreated(payload: any) {
    return this.kafkaClient.emit('post.created', payload);
  }

  
 // =========================
  // ❤️ LIKE EVENT
  // =========================
  async emitLikeEvent(data: {
    userId: string;
    postId: string;
    createdAt: Date;
  }) {
    return this.kafkaClient.emit('post.liked', data);
  }

  // =========================
  // 💔 UNLIKE EVENT
  // =========================
  async emitUnlikeEvent(data: {
    userId: string;
    postId: string;
    createdAt: Date;
  }) {
    return this.kafkaClient.emit('post.unliked', data);
  }

  // =========================
  // 💬 COMMENT EVENT
  // =========================
  async emitCommentEvent(data: {
    userId: string;
    postId: string;
    commentId: string;
  }) {
    return this.kafkaClient.emit('post.commented', data);
  }

  // =========================
  // 👥 FOLLOW EVENT
  // =========================
  async emitFollowEvent(data: {
    followerId: string;
    followingId: string;
    createdAt: Date;
  }) {
    return this.kafkaClient.emit('user.followed', data);
  }

  async emitUnfollowEvent(data: {
    followerId: string;
    followingId: string;
    createdAt: Date;
  }) {
    return this.kafkaClient.emit('user.unfollowed', data);
  }
}

 