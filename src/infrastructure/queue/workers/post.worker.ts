import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Neo4jService } from '../../database/neo4j/neo4j.service';
import { NotificationService } from '../../../modules/notification/notification.service';

@Processor('post-queue')
export class PostWorker extends WorkerHost {
  constructor(
    private neo4j: Neo4jService,
    private notificationService: NotificationService,
  ) {
    super();
    console.log('🚀 PostWorker initialized');
  }

  async process(job: Job): Promise<any> {
    console.log('🔥 JOB RECEIVED:', job.name);

    if (job.name === 'post.created') {
      const { postId, userId } = job.data;

      await this.neo4j.getSession().run(
        `
        MERGE (p:Post {id: $postId})
        MERGE (u:User {id: $userId})
        MERGE (u)-[:CREATED]->(p)
        `,
        { postId, userId },
      );
    }

    if (job.name === 'post.liked') {
      const { userId, postId, postOwnerId } = job.data;

      await this.notificationService.create({
        userId: postOwnerId,
        type: 'like',
        sourceUserId: userId,
        postId,
      });
    }

    return true;
  }
}