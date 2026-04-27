import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { FeedWorker } from './feed.worker';

@Injectable()
export class FeedConsumer implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,

    private readonly feedWorker: FeedWorker,
  ) {}

  async onModuleInit() {
    // subscribe topics
    this.kafkaClient.subscribeToResponseOf('post.created');
    this.kafkaClient.subscribeToResponseOf('user.followed');
    this.kafkaClient.subscribeToResponseOf('user.unfollowed');
  }

  // =========================
  // 📝 NEW POST EVENT
  // =========================
  @MessagePattern('post.created')
  async handlePostCreated(data: any) {
    await this.feedWorker.processNewPost(data.value);
  }

  // =========================
  // 👥 FOLLOW EVENT
  // =========================
  @MessagePattern('user.followed')
  async handleFollow(data: any) {
    await this.feedWorker.handleFollow(data.value);
  }

  // =========================
  // ❌ UNFOLLOW EVENT
  // =========================
  @MessagePattern('user.unfollowed')
  async handleUnfollow(data: any) {
    await this.feedWorker.handleUnfollow(data.value);
  }
}