import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Neo4jService } from '../../database/neo4j/neo4j.service';
import { NotificationService } from '../../../modules/notification/notification.service';

@Processor('like-queue')
export class LikeWorker extends WorkerHost {
  constructor(
    private neo4j: Neo4jService,
    private notificationService: NotificationService,
  ) {
    super();
    console.log('🚀 LikeWorker initialized');
  }

  async process(job: Job): Promise<any> {
    console.log('🔥 LIKE JOB RECEIVED:', job.data);

    // =========================
    // ❤️ LIKE CREATED EVENT
    // =========================
    if (job.name === 'like.created') {
      const { userId, postId, commentId } = job.data;

      const session = this.neo4j.getSession();

      try {
        // =========================
        // POST LIKE
        // =========================
        if (postId) {
          await session.run(
            `
            MATCH (u:User {id: $userId})
            MATCH (p:Post {id: $postId})
            MERGE (u)-[:LIKES]->(p)
            `,
            { userId, postId },
          );
        }

        // =========================
        // COMMENT LIKE
        // =========================
        if (commentId) {
          await session.run(
            `
            MATCH (u:User {id: $userId})
            MATCH (c:Comment {id: $commentId})
            MERGE (u)-[:LIKES]->(c)
            `,
            { userId, commentId },
          );
        }

        console.log('❤️ LIKE SYNCED TO NEO4J');
      } finally {
        await session.close();
      }
    }

    // =========================
    // 🔔 NOTIFICATION (POST LIKE)
    // =========================
    if (job.name === 'post.liked') {
      const { userId, postId, postOwnerId } = job.data;

      await this.notificationService.create({
        userId: postOwnerId,
        type: 'like',
        sourceUserId: userId,
        postId,
      });
    }

    // =========================
    // 🔔 NOTIFICATION (COMMENT LIKE)
    // =========================
    if (job.name === 'comment.liked') {
      const { userId, commentId, commentOwnerId } = job.data;

      await this.notificationService.create({
        userId: commentOwnerId,
        type: 'like',
        sourceUserId: userId,
        commentId,
      });
    }

    return true;
  }
}