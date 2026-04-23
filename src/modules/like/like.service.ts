import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private repo: Repository<Like>,
  ) {}

  // 👍 LIKE POST
 async likePost(userId: number, postId: number) {
  const exists = await this.repo.findOne({ where: { userId, postId } });

  if (!exists) {
    const like = this.repo.create({ userId, postId });
    await this.repo.save(like);
  }

  const likeCount = await this.repo.count({ where: { postId } });

  return {
    postId,
    likeCount,
    likedByMe: true,
  };
}




  // 👍 LIKE COMMENT
 async likeComment(userId: number, commentId: number) {
  const exists = await this.repo.findOne({ where: { userId, commentId } });

  if (!exists) {
    const like = this.repo.create({ userId, commentId });
    await this.repo.save(like);
  }

  const likeCount = await this.repo.count({ where: { commentId } });

  return {
    commentId,
    likeCount,
    likedByMe: true,
  };
}

  // ❌ UNLIKE POST
 async unlikePost(userId: number, postId: number) {
  const existing = await this.repo.findOne({
    where: { userId, postId },
  });

  // ✅ Idempotent behavior
  if (existing) {
    await this.repo.remove(existing);
  }

  const likeCount = await this.repo.count({
    where: { postId },
  });

  return {
    postId,
    likeCount,
    likedByMe: false,
  };
}





  // ❌ UNLIKE COMMENT
  async unlikeComment(userId: number, commentId: number) {
  const existing = await this.repo.findOne({
    where: { userId, commentId },
  });

  if (existing) {
    await this.repo.remove(existing);
  }

  const likeCount = await this.repo.count({
    where: { commentId },
  });

  return {
    commentId,
    likeCount,
    likedByMe: false,
  };
}





  // 📊 COUNT
  countPostLikes(postId: number) {
    return this.repo.count({ where: { postId } });
  }

  countCommentLikes(commentId: number) {
    return this.repo.count({ where: { commentId } });
  }
}