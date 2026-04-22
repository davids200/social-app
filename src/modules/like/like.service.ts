import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../post/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
  ) {}

  async likePost(userId: number, postId: number) {
    const existing = await this.likeRepo.findOne({
      where: { userId, postId },
    });

    if (existing) {
      throw new Error('Already liked');
    }

    const like = this.likeRepo.create({ userId, postId });
    return this.likeRepo.save(like);
  }

  async unlikePost(userId: number, postId: number) {
    return this.likeRepo.delete({ userId, postId });
  }

  async countLikes(postId: number) {
    return this.likeRepo.count({ where: { postId } });
  }
}