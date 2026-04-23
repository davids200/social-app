import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private repo: Repository<Comment>,
  ) {}

  createComment(data: Partial<Comment>) {
    const comment = this.repo.create(data);
    return this.repo.save(comment);
  }

  getPostComments(postId: number) {
    return this.repo.find({
      where: { postId },
      order: { createdAt: 'DESC' },
    });
  }

  getReplies(parentCommentId: number) {
    return this.repo.find({
      where: { parentCommentId },
      order: { createdAt: 'ASC' },
    });
  }
}