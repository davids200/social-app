import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Neo4jService } from '../../database/neo4j/neo4j.service';

@Processor('like-queue')
export class LikeWorker extends WorkerHost {
  constructor(private readonly neo4j: Neo4jService) {
    super();
  }

  async process(job: Job): Promise<any> {
    const session = this.neo4j.getSession();

    try {
      // =========================
      // ❤️ POST LIKE
      // =========================
      if (job.name === 'post.liked') {
        console.log("post liked job data:", job.name);
        const { userId, postId } = job.data;

        await session.run(
          `
          MATCH (u:User {id: $userId})
          MATCH (p:Post {id: $postId})
          MERGE (u)-[:LIKED_POST]->(p)
          `,
          { userId, postId },
        );
      }

      
      // 💔 POST UNLIKE
if (job.name === 'post.unliked') { 
  console.log("post unliked job data:", job.name);

  const { userId, postId } = job.data;

  await session.run(
    `
 MATCH (u:User {id: $userId})-[r:LIKED_POST]->(p:Post {id: $postId})
DELETE r
    `,
    { userId, postId },
  );
}







      // 💬 COMMENT LIKE
if (job.name === 'comment.liked') {
  console.log('comment liked job');

  const { userId, commentId } = job.data;

  await session.run(
    `
    MATCH (u:User {id: $userId})
    MATCH (c:Comment {id: $commentId})
    MERGE (u)-[:LIKED_COMMENT]->(c)
    `,
    { userId, commentId },
  );
}





     // 💔 COMMENT UNLIKE
if (job.name === 'comment.unliked') {
  console.log('comment unliked job');

  const { userId, commentId } = job.data;

  await session.run(
    `
    MATCH (u:User {id: $userId})
  MATCH (c:Comment {id: $commentId})
  OPTIONAL MATCH (u)-[r:LIKED_COMMENT]->(c)
  DELETE r
    `,
    { userId, commentId },
  );
}


    } finally {
      await session.close();
    }

    return true;
  }
}