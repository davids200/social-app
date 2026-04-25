import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Neo4jService } from '../../database/neo4j/neo4j.service';
import { NotificationService } from '../../../modules/notification/notification.service';

@Processor('comment')
export class CommentWorker extends WorkerHost {
  constructor(
    private neo4j: Neo4jService,
    private notificationService: NotificationService,
  ) {
    super();
    console.log('🚀 CommentWorker initialized');
  }
  async process(job: Job): Promise<any> {
  console.log('🔥 COMMENT RECEIVED:', job.data);
  console.log('🔥 COMMENT RECEIVED:', job.name);
    

 
  if (job.name === 'comment.created') {
  const {
    commentId,
    content,
    userId,
    postId,
    parentCommentId,
    createdAt,
  } = job.data;

  const session = this.neo4j.getSession();

  try {
    // =========================
    // MAIN COMMENT SYNC
    // =========================
    await session.run(
      `
      MATCH (u:User {id: $userId})
      MATCH (p:Post {id: $postId})

      MERGE (c:Comment {id: $commentId})
      SET c.content = $content,
          c.createdAt = datetime($createdAt),
          c.userId = $userId,
          c.postId = $postId

      MERGE (u)-[:COMMENTED]->(c)
      MERGE (p)-[:HAS_COMMENT]->(c)
      `,
      {
        commentId,
        userId,
        postId,
        content,
        createdAt,
      },
    );

    // =========================
    // REPLY RELATIONSHIP (WITH CONTENT)
    // =========================
    if (parentCommentId) {
      await session.run(
        `
        MATCH (c:Comment {id: $commentId})
        MATCH (parent:Comment {id: $parentCommentId})

        MERGE (c)-[r:REPLY_TO]->(parent)
        SET r.content = $content,
            r.createdAt = datetime($createdAt)
        `,
        {
          commentId,
          parentCommentId,
          content,
          createdAt,
        },
      );
    }

    console.log('💬 COMMENT SYNCED TO NEO4J');
  } finally {
    await session.close();
  }

  return true;
}




  }
}