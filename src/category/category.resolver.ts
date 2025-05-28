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
import { CategoryService } from './category.service';
import { Category } from './entities/category.graphql.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { User } from '../user/entities/user.graphql.entity';
import { Dish } from '../dish/entities/dish.graphql.entity';
import { GraphQLResolveInfo } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { ComplexityGuard } from '../common/guards/complexity.guard';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: 'categories', complexity: 5 })
  @UseGuards(ComplexityGuard)
  findAll(@Info() info: GraphQLResolveInfo) {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category', complexity: 3 })
  @UseGuards(ComplexityGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category, { complexity: 5 })
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Mutation(() => Category, { complexity: 5 })
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Boolean, { complexity: 3 })
  async removeCategory(@Args('id', { type: () => Int }) id: number) {
    await this.categoryService.remove(id);
    return true;
  }

  @ResolveField(() => User)
  async user(@Parent() category: Category) {
    return this.categoryService.getCategoryUser(category.id);
  }

  @ResolveField(() => [Dish], {
    complexity: ({ args }) => 1 + args.limit,
  })
  async dishes(
    @Parent() category: Category,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ) {
    return this.categoryService.getCategoryDishes(category.id, offset, limit);
  }
}
