import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CommentQueueService {
  constructor(
    @InjectQueue('comment')
    private readonly commentQueue: Queue,
  ) {}




  // =========================
  // 📩 ADD COMMENT CREATED JOB
  // =========================
 async addCommentCreatedJob(data: {
  commentId: string;
  userId: string;
  postId: string;
  parentCommentId?: string | null;
  content: string;
  createdAt: string;
}): Promise<void> {
  await this.commentQueue.add('comment.created', data, {
    attempts: 3, // retry on failure
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
}
}