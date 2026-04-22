import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisOptions } from '../config/redis.config';

@Injectable()
export class PostQueueService {
  private queue = new Queue('post-queue', {
    connection: redisOptions,
  });

  async addPostJob(data: any) {
    return this.queue.add('create-post', data);
  }
}