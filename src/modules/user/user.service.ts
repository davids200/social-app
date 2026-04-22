import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

//   create(username: string, email: string) {
//     const user = this.repo.create({ username, email });
//     return this.repo.save(user);
//   }

  create(username: string, email: string, password: string) {
  const user = this.repo.create({ username, email, password });
  return this.repo.save(user);
}

  findAll() {
    return this.repo.find();
  }

  findByEmail(email: string) {
  return this.repo.findOne({ where: { email } });
}


}