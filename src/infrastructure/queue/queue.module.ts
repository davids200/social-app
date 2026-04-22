import { Module } from '@nestjs/common';
import { PostQueueService } from './post-queue.service';

@Module({
  providers: [PostQueueService],
  exports: [PostQueueService], // 🔥 IMPORTANT
})
export class QueueModule {}