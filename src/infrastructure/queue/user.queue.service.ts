import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisOptions } from '../config/redis.config';

@Injectable()
export class UserQueueService {
  private queue = new Queue('user-queue', {
    connection: redisOptions,
  });

  async addUserCreatedJob(data: any) {
    await this.queue.add('user.created', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

async addFollowJob(data: any) {
  await this.queue.add('user.followed', data);
}

async addUnfollowJob(data: any) {
  await this.queue.add('user.unfollowed', data);
}

}