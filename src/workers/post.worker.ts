import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Worker } from 'bullmq';

// ✅ correct paths
import { redisOptions } from '../infrastructure/config/redis.config';
import { Neo4jService } from '../infrastructure/database/neo4j/neo4j.service';

@Injectable()
export class PostWorker implements OnModuleInit, OnModuleDestroy {
  private worker!: Worker;

  constructor(private neo4jService: Neo4jService) {
     console.log("🧠 PostWorker constructor loaded");
  }

  onModuleInit() {
 console.log("🚀 PostWorker INIT STARTED");

    this.worker = new Worker(
      'post-queue',
      async (job) => {
        console.log('🔥 Processing job:', job.name);

        const { postId, userId, content } = job.data;

        const session = this.neo4jService.getSession();

        try {
          await session.run(
            `
            MATCH (u:User {id: $userId})
            CREATE (p:Post {
              id: $postId,
              content: $content,
              createdAt: timestamp()
            })
            CREATE (u)-[:POSTED]->(p)
            `,
            { postId, userId, content },
          );

          console.log('✅ Neo4j updated for post:', postId);
        } catch (err) {
          console.error('❌ Worker error:', err);
          throw err; // 🔥 REQUIRED for retries
        } finally {
          await session.close();
        }
      },
      {
        connection: redisOptions,
      },
    );

    // ✅ listeners
    this.worker.on('completed', (job) => {
      console.log('🎉 Job completed:', job.id);
    });

    this.worker.on('failed', (job, err) => {
      console.error('💥 Job failed:', job?.id, err);
    });
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
      console.log('🛑 Worker closed');
    }
  }
}