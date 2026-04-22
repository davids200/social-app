import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { UserResponse } from '../user/dto/user-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserResponse) // 🔥 FIXED
  register(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.register(username, email, password);
  }

  @Mutation(() => AuthResponse)
  login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
}