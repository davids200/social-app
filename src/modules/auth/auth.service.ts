import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

 async register(username: string, email: string, password: string) {
  const existingUser = await this.userService.findByEmail(email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hash = await bcrypt.hash(password, 10);
  return this.userService.create(username, email, hash);
}



 async login(email: string, password: string) {
  const user = await this.userService.findByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 🔥 IMPORTANT: correct payload
  const payload = { sub: user.id, email: user.email };

  const accessToken = this.jwtService.sign(payload, {
    expiresIn: '1115m',
  });

  const refreshToken = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  console.log({ accessToken, refreshToken }); // 🔍 debug

  return {
    accessToken,
    refreshToken,
  };
}
}