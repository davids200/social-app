import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class FollowQueueService {
  constructor(
    @InjectQueue('follow-queue')
    private readonly queue: Queue,
  ) {
    console.log('🚀 FollowQueueService initialized');
  }

  // =========================
  // 🔗 FOLLOW   JOB
  // =========================
  async addFollowJob(data: {
    followerId: string;
    followingId: string;
  }) {
    await this.queue.add('user.followed', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }



// =========================
  // 🔗 UNFOLLOW JOB
  // =========================

  async addUnfollowJob(data: {
    followerId: string;
    followingId: string;
  }) {
    await this.queue.add('user.unfollowed', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }






  // =========================
  // 🔔 FOLLOW NOTIFICATION JOB
  // =========================
  async addFollowNotification(data: {
    followerId: string;
    followingId: string;
  }) {
    await this.queue.add('follow.notification', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}