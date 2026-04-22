import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  users() {
    return this.userService.findAll();
  }

  @Mutation(() => User)

@Mutation(() => User)

  createUser(
    @Args('username') username: string,
    @Args('email') email: string,
    // @Args('password') password: string,
  ) {
    return this.userService.create(username, email,'123456');
  }
}