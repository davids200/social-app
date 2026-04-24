import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserModel } from './user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
 
   
@Mutation(() => UserModel)
createUser(
  @Args('username') username: string,
  @Args('email') email: string,
  @Args('password') password: string,
) {
  return this.userService.createUser(username, email, password);
}

 @Query(() => [UserModel])
  users() {
    return this.userService.findAll();
  }
}