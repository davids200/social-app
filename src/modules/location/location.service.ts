import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Location } from './entities/location.entity';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly repo: Repository<Location>,
    private readonly redis: RedisService,
  ) {}



async createLocation(
  name: string,
  level: number,
  parentId?: string,
): Promise<Location> {
  // =========================
  // 🛑 VALIDATION
  // =========================

  if (level < 1) {
    throw new Error('Invalid level');
  }

  let parent: Location | null = null;

  // 🔹 If parent is provided, validate it
  if (parentId) {
    parent = await this.repo.findOne({
      where: { id: parentId },
    });

    if (!parent) {
      throw new Error('Parent location not found');
    }

    // 🔥 enforce hierarchy
    if (parent.level + 1 !== level) {
      throw new Error(
        `Invalid hierarchy: parent level is ${parent.level}, child must be ${parent.level + 1}`,
      );
    }
  } else {
    // 🔥 root must be level 1 (country)
    if (level !== 1) {
      throw new Error(
        'Root location must be level 1 (country)',
      );
    }
  }

  // =========================
  // 💾 CREATE
  // =========================

  const location = this.repo.create({
    name,
    level,
    parentId: parentId ?? undefined, 
  });

  const saved = await this.repo.save(location);

  // =========================
  // 🧹 CACHE INVALIDATION
  // =========================

  await this.redis.deleteByPattern('locations:*');

  return saved;
}



  // 🔹 Get children
  async getByParent(parentId?: string): Promise<Location[]> {
    if (!parentId) {
      // root (countries)
      return this.repo.find({ where: { parentId: IsNull() }, });
    }

    return this.repo.find({ where: { parentId } });
  }

  // 🔹 Get single
  async getById(id: string): Promise<Location | null> {
    return this.repo.findOne({ where: { id } });
  }


  // =========================
  // 🔥 GET LOCATION CHAIN (OPTIMIZED)
  // =========================
  async getLocationChain(locationId: string): Promise<Location[]> {
    // 1️⃣ Fetch all locations once (avoids N+1 queries)
    const locations = await this.repo.find({
      select: ['id', 'parentId', 'level', 'name'],
    });

    const map = new Map<string, Location>();
    locations.forEach((loc) => map.set(loc.id, loc));

    // 2️⃣ Traverse upward in memory (FAST)
    const chain: Location[] = [];
    let current = map.get(locationId);

    if (!current) {
      throw new NotFoundException('Location not found');
    }

    while (current) {
      chain.push(current);

      if (!current.parentId) break;

      current = map.get(current.parentId);
    }

    // 3️⃣ Sort (optional but clean)
    return chain.sort((a, b) => a.level - b.level);
  }
}