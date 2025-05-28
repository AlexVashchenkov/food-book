import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Info,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.graphql.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Dish } from '../dish/entities/dish.graphql.entity';
import { Category } from '../category/entities/category.graphql.entity';
import { GraphQLResolveInfo } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { ComplexityGuard } from '../common/guards/complexity.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users', complexity: 5 })
  @UseGuards(ComplexityGuard)
  findAll(@Info() info: GraphQLResolveInfo) {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', complexity: 3 })
  @UseGuards(ComplexityGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User, { complexity: 5 })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User, { complexity: 5 })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean, { complexity: 3 })
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    await this.userService.remove(id);
    return true;
  }

  @ResolveField(() => [Dish], {
    name: 'dishes',
    complexity: ({ args }) => 1 + args.limit,
  })
  async dishes(
    @Parent() user: User,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.userService.getUserDishes(user.id, offset, limit);
  }

  @ResolveField(() => [Category])
  async categories(
    @Parent() user: User,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.userService.getUserCategories(user.id, offset, limit);
  }
}
