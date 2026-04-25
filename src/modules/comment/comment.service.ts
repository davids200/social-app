import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Comment } from './comment.entity';
import { CommentQueueService } from 'src/infrastructure/queue/comment.queue.service';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    private readonly commentQueue: CommentQueueService,
  ) {}

  // =========================
  // 💬 CREATE COMMENT / REPLY
  // =========================
  async createComment(
    userId: string,
    postId: string,
    content: string,
    parentCommentId?: string,
  ): Promise<Comment> {

    const text = content?.trim();

    if (!text) {
      throw new BadRequestException('Comment cannot be empty');
    }

    // 🔒 CHECK USER (FIXED)
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    // 🔒 CHECK POST (FIXED)
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) {
      throw new BadRequestException('Post does not exist');
    }

    const comment = this.commentRepo.create({
      content: text,
      userId,
      postId,
      parentCommentId: parentCommentId ?? null,
    });

    const saved = await this.commentRepo.save(comment);

    // 🔥 Queue for Neo4j
    await this.commentQueue.addCommentCreatedJob({
      commentId: saved.id,
      userId,
      postId,
      parentCommentId: parentCommentId ?? null,
      content: saved.content,
      createdAt: saved.createdAt.toISOString(),
    });

    return saved;
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