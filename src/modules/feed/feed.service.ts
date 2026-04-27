import { Injectable } from '@nestjs/common'; 
import { Post } from '../post/post.entity';
import { Repository } from 'typeorm';
 import { InjectRepository } from '@nestjs/typeorm'; 

@Injectable()
export class FeedService {


constructor(
   @InjectRepository(Post)
  private readonly postRepo: Repository<Post>, // ✅ now Nest understands
) {}

 
async getVisiblePosts(userId: string) {
  return this.postRepo.query(
    `
    SELECT 
      p.id,
      p.content,
      p.visibility,
      p."createdAt",

      u.id as "authorId",
      u.village,
      u.parish,
      u."subCounty",
      u.district,
      u.country

    FROM post p

    -- author
    JOIN "user" u ON u.id = p."userId"

    -- viewer (current user)
    JOIN "user" viewer ON viewer.id = $1

    WHERE
      -- 🌍 PUBLIC
      p.visibility = 'PUBLIC'

      -- 🌍 COUNTRY
      OR (p.visibility = 'COUNTRY' AND u.country = viewer.country)

      -- 🌍 DISTRICT
      OR (p.visibility = 'DISTRICT' AND u.district = viewer.district)

      -- 🌍 SUBCOUNTY
      OR (p.visibility = 'SUBCOUNTY' AND u."subCounty" = viewer."subCounty")

      -- 🌍 PARISH
      OR (p.visibility = 'PARISH' AND u.parish = viewer.parish)

      -- 🌍 VILLAGE
      OR (p.visibility = 'VILLAGE' AND u.village = viewer.village)

      -- 👥 FOLLOWERS
      OR (
        p.visibility = 'FOLLOWERS'
        AND EXISTS (
          SELECT 1 FROM follow f
          WHERE f."followerId" = viewer.id
          AND f."followingId" = u.id
        )
      )

      -- 🔒 PRIVATE
      OR (
        p.visibility = 'PRIVATE'
        AND u.id = viewer.id
      )

    ORDER BY p."createdAt" DESC

    LIMIT 20
    `,
    [userId],
  );
}


  
}