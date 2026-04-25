import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Neo4jService } from '../../database/neo4j/neo4j.service';
import { NotificationService } from '../../../modules/notification/notification.service';

@Processor('user-queue')
export class UserWorker extends WorkerHost {
  constructor(
    private neo4j: Neo4jService,
    private notificationService: NotificationService,
  ) {
    super();
    console.log('🚀 UserWorker initialized');
  }

  async process(job: Job): Promise<any> {
    console.log('🔥 JOB RECEIVED:', job.name, job.data);

    switch (job.name) {

      // =========================
      // 👤 USER CREATED
      // =========================
      case 'user.created': {
        const { id, username, email } = job.data;

        const session = this.neo4j.getSession();

      try {
  await session.run(
    `
    MERGE (u:User {id: $id})
    SET u.username = $username,
        u.email = $email
    `,
    {
      id: String(id), 
      username,
      email,
    },
  );

  console.log('🟢 Neo4j user created:', String(id));
} catch (err) {
  console.error('❌ Neo4j error (user.created):', err);
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