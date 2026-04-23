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
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {

      // =========================
      // 📝 POST CREATED
      // =========================
      case 'post.created': {
        const { postId, userId } = job.data;

        console.log('🟢 Processing post.created:', postId);

        // 1. Create node in Neo4j (for feed graph)
        await this.neo4j.getSession().run(
          `
          MERGE (p:Post {id: $postId})
          MERGE (u:User {id: $userId})
          MERGE (u)-[:CREATED]->(p)
          `,
          { postId, userId },
        );

        // 2. Build feed edges (fan-out model simple version)
        await this.neo4j.getSession().run(
          `
          MATCH (u:User {id: $userId})-[:FOLLOWS]->(f:User)
          MERGE (f)-[:SEES]->(p:Post {id: $postId})
          `,
          { postId, userId },
        );

        return true;
      }

      // =========================
      // ❤️ POST LIKED
      // =========================
      case 'post.liked': {
        const { userId, postId } = job.data;

        console.log('❤️ Processing post.liked');

        // Notification
        await this.notificationService.create({
          userId: job.data.postOwnerId,
          type: 'like',
          sourceUserId: userId,
          postId,
        });

        return true;
      }

      // =========================
      // 👤 USER FOLLOWED
      // =========================
      case 'user.followed': {
        const { followerId, followingId } = job.data;

        console.log('👤 Processing follow event');

        await this.notificationService.create({
          userId: followingId,
          type: 'follow',
          sourceUserId: followerId,
        });

        return true;
      }

      default:
        console.log('⚠️ Unknown job:', job.name);
        return true;
    }
  }
}