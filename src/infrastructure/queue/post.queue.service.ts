import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisOptions } from '../config/redis.config';
import { InjectQueue } from '@nestjs/bullmq';


@Injectable()
export class PostQueueService {
  constructor(@InjectQueue('post-queue') private queue: Queue) {}

  async addPostJob(data: any) {
    await this.queue.add('post.created', data);
  }

  async addLikeJob(data: any) {
    await this.queue.add('post.liked', data);
  }


}