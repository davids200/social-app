import { Injectable } from '@nestjs/common'; 
import { Post } from '../post/post.entity';
import { Repository } from 'typeorm';
 import { InjectRepository } from '@nestjs/typeorm'; 
import { FeedProducer } from './producers/feed.producer';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class FeedService {


constructor(
   @InjectRepository(Post)
  private readonly postRepo: Repository<Post>, // ✅ now Nest understands
  private readonly feedProducer: FeedProducer,
  private readonly redis: RedisService, // 🔥 Redis for location chain caching
) {}

 

async getFeed(userId: string) {
  // 1. get user location chain (Redis first)
  const userChain = await this.redis.getCache<string[]>(
    `user:${userId}:locationChain`,
  );

  // fallback if missing
  if (!userChain) {
    throw new Error('User location not set');
  }

  // 2. fetch posts (ScyllaDB / Postgres / Kafka materialized feed)
  const posts = await this.postRepo.find({
    order: { createdAt: 'DESC' },
    take: 50,
  });

  // 3. filter in memory (FAST + scalable with pre-filtering later)
  return posts.filter((post) => {
    switch (post.visibility) {
      case 'PUBLIC':
        return true;

      case 'COUNTRY':
        return userChain.length >= 1;

      case 'DISTRICT':
        return userChain.length >= 2;

      case 'SUBCOUNTY':
        return userChain.length >= 3;

      case 'PARISH':
        return userChain.length >= 4;

      case 'VILLAGE':
        return userChain.length >= 5;

      case 'FOLLOWERS':
        return true; // handled via follow graph

      case 'PRIVATE':
        return post.userId === userId;

      default:
        return false;
    }
  });
}
  
}