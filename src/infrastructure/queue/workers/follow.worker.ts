import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Neo4jService } from '../../database/neo4j/neo4j.service';
import { NotificationService } from '../../../modules/notification/notification.service';

@Processor('follow-queue')
export class FollowWorker extends WorkerHost {
  constructor(
    private neo4j: Neo4jService,
    private notificationService: NotificationService,
  ) {
    super();
    console.log('🚀 FollowWorker initialized');
  }

  async process(job: Job): Promise<any> {
    console.log('🔥 FOLLOW JOB RECEIVED:', job.name, job.data);

    switch (job.name) {

      // =========================
      // 👤 USER CREATED
      // =========================
    

      // =========================
      // 👥 FOLLOW USER
      // =========================
    
  case 'user.followed': { 
    console.log("USER FOLLOWED JOB:", job.name);
  const { followerId, followingId } = job.data;   

  const session = this.neo4j.getSession();
  try {
    // 1. Check both users exist
   const check = await session.run(
  `
  MATCH (a:User {id: $followerId})
  MATCH (b:User {id: $followingId})
  RETURN a, b
  `,
  {
    followerId: String(followerId),
    followingId: String(followingId),
  },
);

    // 2. Validate existence
    if (check.records.length === 0) {
      throw new Error('❌ Either follower or following user does not exist');
    }

    // 3. Create relationship safely
    await session.run(
      `
      MATCH (a:User {id: $followerId})
      MATCH (b:User {id: $followingId})
      MERGE (a)-[:FOLLOWS]->(b)
      `,
      {
        followerId: String(followerId),
        followingId: String(followingId),
      },
    );

    console.log('✅ FOLLOW CREATED IN NEO4J');
  } catch (error:any) {
    console.error('❌ FOLLOW ERROR:', error.message);
  } finally {
    await session.close();
  }

  return true;
}



      // =========================
      // 👥 UNFOLLOW USER
      // =========================
    
case 'user.unfollowed': {
const { followerId, followingId } = job.data;
const session = this.neo4j.getSession();

try {
// 1. Check both users exist
const check = await session.run(
`
MATCH (a:User {id: $followerId})
MATCH (b:User {id: $followingId})
RETURN a, b
`,
{
followerId: String(followerId),
followingId: String(followingId),
},
);

// 2. Validate existence
if (check.records.length === 0) {
throw new Error('❌ Either follower or following user does not exist');
}

// 3. Delete relationship safely (UNFOLLOW)
await session.run(
`
MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followingId})
DELETE r
`,
{
followerId: String(followerId),
followingId: String(followingId),
},
);

console.log('✅ UNFOLLOW PROCESSED IN NEO4J');
} catch (error: any) {
console.error('❌ UNFOLLOW ERROR:', error.message);
} finally {
await session.close();
}

return true;
}

      default:
        console.log('⚠️ Unknown job:', job.name);
        return true;
    }
  }
}