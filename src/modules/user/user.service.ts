import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; 
 import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>, 
  ) {}


 

async createUser(username: string, email: string, password: string) {
  // 1. Hash password BEFORE saving (IMPORTANT)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Save to PostgreSQL (source of truth)
  const user = this.repo.create({
    username,
    email,
    password: hashedPassword,
  });

  const saved = await this.repo.save(user);

  console.log('🟢 User saved in Postgres:', saved.id);

  

  console.log('📨 User sent to Redis queue');

  return saved;
}
  

  findAll() {
    return this.repo.find();
  }

  async findUserById(id: string) {
  return this.repo.findOne({ where: { id } });
}

   findUserByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}