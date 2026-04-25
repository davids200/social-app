import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follow } from './follow.entity';
import { User } from '../user/user.entity';
import { FollowQueueService } from 'src/infrastructure/queue/follow.queue.service';
import { Neo4jService } from 'src/infrastructure/database/neo4j/neo4j.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly followQueue: FollowQueueService,
    private readonly neo4j: Neo4jService,
  ) {}

  // =========================
  // 🔐 UUID CHECK
  // =========================
  private isValidUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  // =========================
  // 👤 FOLLOW / UNFOLLOW
  // =========================
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    if (!followerId) {
      throw new BadRequestException('Unauthorized user');
    }

    if (!followingId) {
      throw new BadRequestException('followingId is required');
    }

    if (!this.isValidUUID(followingId)) {
      throw new BadRequestException('Invalid Input!');
    }

    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // =========================
    // 👤 CHECK USER EXISTS
    // =========================
    const user = await this.userRepo.findOne({
      where: { id: followingId },
    });

    if (!user) {
      throw new BadRequestException('Following user does not exist');
    }

    // =========================
    // 🔄 CHECK FOLLOW STATE
    // =========================
    const existing = await this.followRepo.findOne({
      where: { followerId, followingId },
    });

    let isFollowing: boolean;

    if (existing) {
      await this.followRepo.delete(existing.id);
      isFollowing = false;

      // 🚀 UNFOLLOW EVENT
      await this.followQueue.addUnfollowJob({
        followerId,
        followingId,
      });
    } else {
      await this.followRepo.save({
        followerId,
        followingId,
      });
      isFollowing = true;

      // 🚀 FOLLOW EVENT
      await this.followQueue.addFollowJob({
        followerId,
        followingId,
      });
    }

    return isFollowing;
  }

  // =========================
  // ❌ EXPLICIT UNFOLLOW
  // =========================
  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    if (!this.isValidUUID(followingId)) {
      throw new BadRequestException('Invalid followingId');
    }

    const existing = await this.followRepo.findOne({
      where: { followerId, followingId },
    });

    if (!existing) return false;

    await this.followRepo.delete(existing.id);

    await this.followQueue.addUnfollowJob({
      followerId,
      followingId,
    });

    return true;
  }

  // =========================
  // 👥 FOLLOWING (NEO4J)
  // =========================
  async getFollowing(userId: string) {
    const session = this.neo4j.getSession();

    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:FOLLOWS]->(f:User)
        RETURN f
        `,
        { userId },
      );

      return result.records.map((r) => r.get('f').properties);
    } finally {
      await session.close();
    }
  }

  // =========================
  // 👥 FOLLOWERS (NEO4J)
  // =========================
  async getFollowers(userId: string) {
    const session = this.neo4j.getSession();

    try {
      const result = await session.run(
        `
        MATCH (f:User)-[:FOLLOWS]->(u:User {id: $userId})
        RETURN f
        `,
        { userId },
      );

      return result.records.map((r) => r.get('f').properties);
    } finally {
      await session.close();
    }
  }

  // =========================
  // ✅ USER EXISTS
  // =========================
  async userExists(userId: string): Promise<boolean> {
    if (!this.isValidUUID(userId)) return false;

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    return !!user;
  }
}