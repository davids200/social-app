import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Comment } from './comment.entity'; 
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { FeedProducer } from '../feed/producers/feed.producer';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
private readonly redis: RedisService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
private readonly feedProducer: FeedProducer,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>, 
  ) {}

  // =========================
  // 💬 CREATE COMMENT / REPLY
  // =========================
  async createComment(userId: string, postId: string, text: string,parentCommentId?: string) {
  // 1. Save in DB
  const comment = await this.commentRepo.save({
    userId,
    postId,
    text,
    parentCommentId: parentCommentId || null,
  });

  // 2. Fast counter update
  await this.redis.incrementComment(postId);

  // 3. Kafka event
  await this.feedProducer.emitCommentEvent({
    userId,
    postId,
    commentId: comment.id,
  });

  return comment;
}





  // =========================
  // 📄 GET COMMENTS (FLAT)
  // =========================
  async getPostComments(postId: string): Promise<Comment[]> {
    return this.commentRepo.find({
      where: {
        postId,
        parentCommentId: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  // =========================
  // 💬 GET REPLIES
  // =========================
  async getReplies(parentCommentId: string): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { parentCommentId },
      order: { createdAt: 'ASC' },
    });
  }

  // =========================
  // 🌳 COMMENT TREE
  // =========================
  async getCommentTree(postId: string): Promise<Comment[]> {
    const comments = await this.commentRepo.find({
      where: { postId },
      order: { createdAt: 'ASC' },
    });

    const map = new Map<string, any>();
    const roots: any[] = [];

    for (const comment of comments) {
      map.set(comment.id, { ...comment, replies: [] });
    }

    for (const comment of comments) {
      const node = map.get(comment.id);

      if (comment.parentCommentId) {
        const parent = map.get(comment.parentCommentId);
        parent?.replies.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}