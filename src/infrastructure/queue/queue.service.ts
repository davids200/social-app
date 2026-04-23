import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisOptions } from '../config/redis.config';

@Injectable()
export class PostQueueService {
  private queue = new Queue('post-queue', {
    connection: redisOptions,
  });


  async addPostCreatedJob(data: any) {
  await this.queue.add('post.created', data);
}

//   async addPostJob(data: {
//     postId: number;
//     userId: number;
//     content: string;
//   }) {
//     await this.queue.add('create-post', data, {
//       attempts: 3, // retry if Neo4j fails
//       backoff: {
//         type: 'exponential',
//         delay: 2000,
//       },
//     });
//   }
}